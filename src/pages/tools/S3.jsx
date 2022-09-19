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
} from '@adobe/react-spectrum';
import NoSearchResults from '@spectrum-icons/illustrations/NoSearchResults';
import { ContentHeader } from '../../components/ContentHeader';
import Search from '@spectrum-icons/workflow/Search';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores';
import { awsAccounts } from '../../config';

export const S3Home = observer(() => {
  return <ContentHeader title="S3 Tools" />;
});

export const S3FindBucket = observer(() => {
  const { appStore, s3ToolsStore } = useStores();
  const [data, setData] = useState([]);
  const [currentAcc, setCurrentAcc] = useState(null);
  const [bucketName, setBucketName] = useState('');
  const [searchBy, setSearchBy] = useState('fullname');
  const [done, setDone] = useState(false);

  const findBucket = async () => {
    setData([]);
    setDone(false);

    let accounts = [appStore.account];

    if (appStore.account.id === 'allAccounts') {
      accounts = awsAccounts;
    }

    for (const acc of accounts) {
      setCurrentAcc(acc);

      const result = await s3ToolsStore.fetchS3Tools({
        account: acc.id,
        fn: 'find-bucket',
        bucketName,
        searchBy,
      });

      if (result && result.buckets.length > 0) {
        setData((arr) => [...arr, { account: acc.name, buckets: result.buckets }]);
      }
    }

    setCurrentAcc(null);
    setDone(true);
  };

  return (
    <View>
      <ContentHeader title={`Find a bucket in: ${appStore.account.name}`} />

      <View
        borderRadius="regular"
        paddingX="size-300"
        paddingY="size-200"
        backgroundColor="gray-200"
        marginBottom="size-400">
        <Form marginBottom="size-300">
          <TextField label="Bucket Name" value={bucketName} onChange={setBucketName} />
          <RadioGroup
            isEmphasized
            label="Search by"
            orientation="horizontal"
            value={searchBy}
            onChange={setSearchBy}>
            <Radio value="fullname">Full Name</Radio>
            <Radio value="prefix">Prefix (slower)</Radio>
          </RadioGroup>
        </Form>

        <View marginBottom="size-200">
          <Button variant="cta" onPress={findBucket}>
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
                    <Column>Bucket name</Column>
                    <Column align="end">Creation date</Column>
                  </TableHeader>
                  <TableBody>
                    {item.buckets.map((bucket, index) => {
                      return (
                        <Row key={`${bucket.name}_${index}`}>
                          <Cell>{bucket.name}</Cell>
                          <Cell>{new Date(bucket.creation_date).toLocaleString()}</Cell>
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
