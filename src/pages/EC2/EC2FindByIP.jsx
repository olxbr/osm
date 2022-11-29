import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  TextField,
  Form,
  View,
  Text,
  RadioGroup,
  Radio,
  TableView,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  Heading,
  Content,
  IllustratedMessage,
  Flex,
  ProgressBar,
  Divider,
  Well,
  ActionButton,
  Link,
  TooltipTrigger,
  Tooltip,
} from '@adobe/react-spectrum';
import NoSearchResults from '@spectrum-icons/illustrations/NoSearchResults';
import Search from '@spectrum-icons/workflow/Search';
import LinkOut from '@spectrum-icons/workflow/LinkOut';
import { observer } from 'mobx-react-lite';
import { useMsal } from '@azure/msal-react';
import { useStores } from '../../stores';
import { requestAccessToken, toDate } from '../../helpers';
import { ContentHeader } from '../../components/ContentHeader';

export const EC2FindByIP = observer(() => {
  const { instance } = useMsal();
  const { appStore, ec2Store } = useStores();
  const { data } = ec2Store.findInstanceData;

  const [currentAcc, setCurrentAcc] = useState(null);
  const [ip, setIp] = useState('');
  const [ipType, setIpType] = useState('public');
  const [done, setDone] = useState(false);

  const findInstance = async () => {
    if (ip.length < 7) {
      return;
    }

    ec2Store.setFindInstanceData({
      account: appStore.account.name,
      ip,
      ipType,
      data: [],
    });

    setDone(false);

    const accessToken = await requestAccessToken(instance);
    let awsAccounts = [appStore.account];

    if (appStore.account.id === 'allAccounts') {
      awsAccounts = appStore.accounts;
    }

    for (const account of awsAccounts) {
      setCurrentAcc(account);

      const result = await ec2Store.findInstance(accessToken, {
        account: account.id,
        ip,
        ipType,
      });

      if (result && result.instances?.length > 0) {
        ec2Store.addFindInstanceData({
          account: account.name,
          accountId: account.id,
          instances: result.instances,
        });

        break;
      }
    }

    setCurrentAcc(null);
    setDone(true);
  };

  return (
    <View>
      <ContentHeader title="Find EC2 instance by IP" />

      <View
        borderRadius="regular"
        paddingX="size-300"
        paddingY="size-200"
        backgroundColor="gray-200"
        marginBottom="size-300">
        <Form marginBottom="size-300" onSubmit={(e) => e.preventDefault()}>
          <Flex justifyContent="space-between">
            <RadioGroup
              isRequired
              isEmphasized
              label="Filters"
              orientation="horizontal"
              value={ipType}
              onChange={setIpType}>
              <Radio value="public">Public IP</Radio>
              <Radio value="private">Private IP</Radio>
            </RadioGroup>
          </Flex>

          <TextField
            label="Instance IP"
            value={ip}
            onChange={setIp}
            onKeyUp={(e) => e.key === 'Enter' && findInstance()}
            description="Insert a valid IP address"
          />
        </Form>

        <View marginBottom="size-100">
          <Button variant="cta" onPress={findInstance} isDisabled={ip.length < 7}>
            <Search />
            <Text>Search</Text>
          </Button>
        </View>
      </View>

      {currentAcc && (
        <View padding="size-500" marginBottom="size-400">
          <Flex justifyContent="center" alignItems="center" direction="column">
            <Content marginBottom="size-100">Searching {currentAcc.name} ...</Content>
            <ProgressBar aria-label="Loading" isIndeterminate />
          </Flex>
        </View>
      )}

      {data?.length > 0 && (
        <Well marginBottom="size-300">
          <Flex alignItems="center">
            <div>
              <strong>Search terms:</strong>
              <br />
              <span style={{ display: 'inline-block', marginRight: '10px' }}>
                Account: <em>{ec2Store.findInstanceData.account}</em>
              </span>
              <span style={{ display: 'inline-block', marginRight: '10px' }}>
                Instance IP: <em>{ec2Store.findInstanceData.ip}</em>
              </span>
              <span style={{ display: 'inline-block', marginRight: '10px' }}>
                IP type: <em>{ec2Store.findInstanceData.ipType}</em>
              </span>
            </div>
            <Divider orientation="vertical" size="S" marginStart="size-300" marginEnd="size-300" />
            <ActionButton onPress={() => ec2Store.resetFindInstanceData()}>Clear</ActionButton>
          </Flex>
        </Well>
      )}

      {data?.length > 0 &&
        data.map((item, index) => {
          return (
            item.instances.length > 0 && (
              <React.Fragment key={`acc-${index}`}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading level={3}>{item.account}</Heading>
                </Flex>
                <TableView
                  // selectionMode="multiple"
                  overflowMode="wrap"
                  marginBottom="size-400"
                  aria-label={`${item.account} instances`}>
                  <TableHeader>
                    <Column key="instanceId" align="start">
                      Instance ID
                    </Column>
                    <Column key="instanceType">Instance Type</Column>
                    <Column key="launchTime" align="end">
                      Launch Time
                    </Column>
                  </TableHeader>
                  <TableBody>
                    {item.instances.map((instance) => {
                      return (
                        <Row key={instance.InstanceId}>
                          <Cell>
                            <TooltipTrigger delay={0}>
                              <Link isQuiet>
                                <a
                                  target="_blank"
                                  href={`https://console.aws.amazon.com/ec2/home#InstanceDetails:instanceId=${instance.InstanceId}`}>
                                  {instance.InstanceId}
                                  <LinkOut size="XS" marginStart="size-100" />
                                </a>
                              </Link>
                              <Tooltip>Open in AWS Console</Tooltip>
                            </TooltipTrigger>

                            {/* <RouterLink to={`/tools/ec2/instances/${instance.InstanceId}`}>
                              {instance.InstanceId}
                            </RouterLink> */}
                          </Cell>
                          <Cell>{instance.InstanceType}</Cell>
                          <Cell>{toDate(instance.LaunchTime, 'long')}</Cell>
                        </Row>
                      );
                    })}
                  </TableBody>
                </TableView>
              </React.Fragment>
            )
          );
        })}

      {done && data.length <= 0 && (
        <View padding="size-500">
          <IllustratedMessage>
            <NoSearchResults />
            <Heading>No matching results</Heading>
            <Content>Try another search</Content>
          </IllustratedMessage>
        </View>
      )}
    </View>
  );
});
