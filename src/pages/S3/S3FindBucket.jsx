import React, { useState } from 'react';
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
  Dialog,
  DialogContainer,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Item,
  ButtonGroup,
  Well,
  ProgressCircle,
  ActionButton,
} from '@adobe/react-spectrum';
import NoSearchResults from '@spectrum-icons/illustrations/NoSearchResults';
import { ContentHeader } from '../../components/ContentHeader';
import Search from '@spectrum-icons/workflow/Search';
import { observer } from 'mobx-react-lite';
import { useMsal } from '@azure/msal-react';
import { useStores } from '../../stores';
import { requestAccessToken } from '../../helpers';

export const S3FindBucket = observer(() => {
  const { instance } = useMsal();
  const { appStore, s3ToolsStore } = useStores();
  const { data } = s3ToolsStore.findBucketData;

  const [currentAcc, setCurrentAcc] = useState(null);
  const [bucketName, setBucketName] = useState('');
  const [searchBy, setSearchBy] = useState('fullname');
  const [done, setDone] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [bucketInfo, setBucketInfo] = useState(null);

  const findBucket = async () => {
    if (bucketName.length < 3) {
      return;
    }

    s3ToolsStore.setFindBucketData({
      account: appStore.account.name,
      query: bucketName,
      searchBy,
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

      const result = await s3ToolsStore.findBucket(accessToken, {
        account: account.id,
        bucketName,
        searchBy,
      });

      if (result && result.buckets.length > 0) {
        s3ToolsStore.addFindBucketData({
          account: account.name,
          accountId: account.id,
          buckets: result.buckets,
        });

        if (searchBy === 'fullname') {
          break;
        }
      }
    }

    setCurrentAcc(null);
    setDone(true);
  };

  const showBucketInfo = async (name, accountId) => {
    setDialog('info');
    const accessToken = await requestAccessToken(instance);

    const result = await s3ToolsStore.fetchS3Tools(accessToken, {
      account: accountId,
      fn: 'bucket-info',
      bucketName: name,
    });

    if (result) {
      setBucketInfo(result.bucket);
    } else {
      setDialog(null);
    }
  };

  const clearDialog = () => {
    setDialog(null);
    setBucketInfo(null);
  };

  const formatJson = (json) => {
    return JSON.stringify(JSON.parse(json === '' ? '{}' : json), null, 2);
  };

  return (
    <View>
      <ContentHeader title={`Find a bucket in: ${appStore.account.name}`} />

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
              necessityIndicator="icon"
              isEmphasized
              label="Search by"
              orientation="horizontal"
              value={searchBy}
              onChange={setSearchBy}>
              <Radio value="fullname">Full Name</Radio>
              <Radio value="prefix">Prefix</Radio>
            </RadioGroup>
          </Flex>

          <TextField
            label={`Bucket ${searchBy === 'prefix' ? 'Prefix' : 'Name'}`}
            value={bucketName}
            onChange={setBucketName}
            onKeyUp={(e) => e.key === 'Enter' && findBucket()}
            description="Minimum of 3 characters"
          />
        </Form>

        <View marginBottom="size-200">
          <Button variant="cta" onPress={findBucket} isDisabled={bucketName.length < 3}>
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

      {data.length > 0 && (
        <Well marginBottom="size-300">
          <Flex alignItems="center">
            <div>
              <strong>Search terms:</strong>
              <br />
              <span style={{ display: 'inline-block', marginRight: '10px' }}>
                Account: <em>{s3ToolsStore.findBucketData.account}</em>
              </span>
              <span style={{ display: 'inline-block', marginRight: '10px' }}>
                Bucket {s3ToolsStore.findBucketData.searchBy === 'fullname' ? 'Name' : 'Prefix'}:{' '}
                <em>{s3ToolsStore.findBucketData.query}</em>
              </span>
            </div>
            <Divider orientation="vertical" size="S" marginStart="size-300" marginEnd="size-300" />
            <ActionButton onPress={() => s3ToolsStore.resetFindBucketData()}>Clear</ActionButton>
          </Flex>
        </Well>
      )}

      {data.length > 0 &&
        data.map((item, index) => {
          return (
            item.buckets.length > 0 && (
              <React.Fragment key={`acc-${index}`}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Heading level={3}>{item.account}</Heading>
                </Flex>
                <TableView
                  // selectionMode="multiple"
                  overflowMode="wrap"
                  marginBottom="size-400"
                  aria-label={`${item.account} buckets`}>
                  <TableHeader>
                    <Column key="name" align="start">
                      Bucket name
                    </Column>
                    <Column key="creation_date" align="end">
                      Creation date
                    </Column>
                  </TableHeader>
                  <TableBody>
                    {item.buckets.map((bucket, index) => {
                      return (
                        <Row key={`${bucket.name}_${index}`}>
                          <Cell>
                            <a
                              href={`#${bucket.name}`}
                              onClick={() => showBucketInfo(bucket.name, item.accountId)}>
                              {bucket.name}
                            </a>
                          </Cell>
                          <Cell>{new Date(bucket.creation_date).toLocaleString()}</Cell>
                        </Row>
                      );
                    })}
                  </TableBody>
                </TableView>
                <DialogContainer onDismiss={clearDialog}>
                  {dialog === 'info' && (
                    <Dialog>
                      <Heading>{bucketInfo ? bucketInfo.name : '...'}</Heading>
                      <Divider marginBottom="size-300" />
                      <Content>
                        {bucketInfo ? (
                          <Tabs aria-label="Bucket Info">
                            <TabList>
                              <Item key="Status">Status</Item>
                              <Item key="Policy">Policy</Item>
                            </TabList>
                            <TabPanels marginTop="size-300">
                              <Item key="Status">
                                <Well>
                                  <pre>{bucketInfo.public_status}</pre>
                                </Well>
                              </Item>
                              <Item key="Policy">
                                <Well>
                                  <pre>{formatJson(bucketInfo.policy)}</pre>
                                </Well>
                              </Item>
                            </TabPanels>
                          </Tabs>
                        ) : (
                          <Flex justifyContent="center">
                            <ProgressCircle aria-label="Loading…" size="L" isIndeterminate />
                          </Flex>
                        )}
                      </Content>
                      <ButtonGroup>
                        <Button variant="link" onPress={clearDialog}>
                          Close
                        </Button>
                      </ButtonGroup>
                    </Dialog>
                  )}
                </DialogContainer>
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
