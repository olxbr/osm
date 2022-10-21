import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TableView,
  TableHeader,
  Column,
  Row,
  Cell,
  Heading,
  Content,
  TableBody,
  IllustratedMessage,
} from '@adobe/react-spectrum';
import NoSearchResults from '@spectrum-icons/illustrations/NoSearchResults';
import { ContentHeader } from '../../components/ContentHeader';
import { observer } from 'mobx-react-lite';
import { useMsal } from '@azure/msal-react';
import { useStores } from '../../stores';
import { requestAccessToken } from '../../helpers';

export const S3ListBuckets = observer(() => {
  const { instance } = useMsal();
  const { appStore, s3ToolsStore } = useStores();

  const [buckets, setBuckets] = useState([]);
  const [done, setDone] = useState(false);

  const listBuckets = async () => {
    setDone(false);

    const accessToken = await requestAccessToken(instance);

    const result = await s3ToolsStore.fetchS3Tools(accessToken, {
      account: appStore.account.id,
      fn: 'list-buckets',
    });

    if (result && result.buckets.length > 0) {
      setBuckets(result.buckets);
    }

    setDone(true);
  };

  return (
    <View>
      <ContentHeader title="List all buckets in an Account" />
      <View
        borderRadius="regular"
        paddingX="size-300"
        paddingY="size-200"
        backgroundColor="gray-200"
        marginBottom="size-300">
        <View marginBottom="size-300">
          {appStore.account.id === 'allAccounts' ? (
            <Text>Select an Account in the Sidebar to list buckets *</Text>
          ) : (
            <Text>
              Current Account: <strong>{appStore.account.name}</strong>
            </Text>
          )}
        </View>

        <View marginBottom="size-200">
          <Button
            variant="cta"
            onPress={listBuckets}
            isDisabled={appStore.account.id === 'allAccounts'}>
            <Text>List Buckets</Text>
          </Button>
        </View>
      </View>

      {buckets.length > 0 && (
        <TableView
          // selectionMode="multiple"
          overflowMode="wrap"
          marginBottom="size-400"
          aria-label={`${appStore.account.name} buckets`}>
          <TableHeader>
            <Column>Bucket name</Column>
            <Column>Creation date</Column>
          </TableHeader>
          <TableBody>
            {buckets.map((bucket, index) => {
              return (
                <Row key={`${bucket.name}_${index}`}>
                  <Cell>
                    <a href="#">{bucket.name}</a>
                  </Cell>
                  <Cell>{new Date(bucket.creation_date).toLocaleString()}</Cell>
                </Row>
              );
            })}
          </TableBody>
        </TableView>
      )}

      {done && buckets.length <= 0 && (
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
