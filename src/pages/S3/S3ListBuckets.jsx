import React, { useState } from 'react';
// import { useCollator } from 'react-aria';
import { Link as RouterLink } from 'react-router-dom';
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
  Flex,
  ActionButton,
  ProgressBar,
} from '@adobe/react-spectrum';
import Refresh from '@spectrum-icons/workflow/Refresh';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import AlertCircleFilled from '@spectrum-icons/workflow/AlertCircleFilled';
import CloseCircle from '@spectrum-icons/workflow/CloseCircle';
import NoSearchResults from '@spectrum-icons/illustrations/NoSearchResults';
import { ContentHeader } from '../../components/ContentHeader';
import { observer } from 'mobx-react-lite';
import { useMsal } from '@azure/msal-react';
import { useStores } from '../../stores';
import { requestAccessToken } from '../../helpers';

export const S3ListBuckets = observer(() => {
  const { instance } = useMsal();
  const { appStore, s3ToolsStore } = useStores();
  const { buckets, updated_at } = s3ToolsStore.listBucketsData;

  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState({ active: false, msg: 'Loading...' });
  // const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const handleLoading = (active, msg = 'Loading...') => {
    setLoading({ active, msg });
  };

  const addSummary = () => {
    const data = s3ToolsStore.listBucketsData;

    data.buckets.map((b) => {
      for (let s of s3ToolsStore.bucketsSummary.data) {
        if (b.name === s.bucket) {
          b.summary = s;
        }
      }
      return b;
    });

    s3ToolsStore.setListBucketsData(data);
  };

  const listBuckets = async (mode = 'latest') => {
    setDone(false);
    handleLoading(
      true,
      `${mode === 'latest' ? 'Listing' : 'Updating'} ${appStore.account.name} buckets...`
    );
    s3ToolsStore.resetListBucketsData();

    const accessToken = await requestAccessToken(instance);

    const listResult = await s3ToolsStore.listBuckets(accessToken, {
      account: appStore.account.id,
      mode,
    });

    handleLoading(true, 'Get review data...');
    const summaryResult = await s3ToolsStore.listBucketsSummary(accessToken, {
      account: appStore.account.id,
    });

    s3ToolsStore.setListBucketsData(listResult);

    s3ToolsStore.setBucketsSummary({
      account: appStore.account.id,
      data: summaryResult,
    });

    addSummary(summaryResult);

    setDone(true);
    handleLoading(false);
  };

  const statusIcons = {
    notReviewed: <CloseCircle color="negative" size="S" />,
    withCaveats: <AlertCircleFilled color="notice" size="S" />,
    reviewed: <CheckmarkCircle color="positive" size="S" />,
  };

  return (
    <View>
      <ContentHeader title="List all buckets in an Account" />
      <View
        borderRadius="regular"
        paddingX="size-300"
        paddingY="size-200"
        backgroundColor="gray-200"
        marginBottom="size-400">
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
            onPress={() => listBuckets()}
            isDisabled={appStore.account.id === 'allAccounts'}>
            <Text>List Buckets</Text>
          </Button>
        </View>
      </View>

      {loading.active && (
        <View padding="size-500" marginBottom="size-400">
          <Flex justifyContent="center" alignItems="center" direction="column">
            <Content marginBottom="size-100">{loading.msg}</Content>
            <ProgressBar aria-label="Loading" isIndeterminate />
          </Flex>
        </View>
      )}

      {buckets.length > 0 && (
        <Flex justifyContent="space-between" alignItems="center" marginBottom="size-300">
          <Text>
            <strong>{buckets.length}</strong> buckets
          </Text>
          <Flex alignItems="center">
            <Text marginEnd="size-200">
              <strong>Last update:</strong> {new Date(updated_at + 'Z').toLocaleString()}
            </Text>
            <ActionButton onPress={() => listBuckets('update')}>
              <Refresh />
              <Text>Update</Text>
            </ActionButton>
          </Flex>
        </Flex>
      )}

      {buckets.length > 0 && (
        <TableView
          // selectionMode="single"
          // selectedKeys={selectedKeys}
          // onSelectionChange={setSelectedKeys}
          marginBottom="size-400"
          aria-label={`${appStore.account.name} buckets`}>
          <TableHeader>
            <Column key="name" align="start">
              Bucket Name
            </Column>
            <Column key="status">Bucket Status</Column>
            <Column key="reviewed" align="center">
              Reviewed
            </Column>
            <Column key="creation_date" align="end">
              Creation Date
            </Column>
          </TableHeader>
          <TableBody>
            {buckets.map((bucket) => {
              return (
                <Row key={bucket.name}>
                  <Cell>
                    <RouterLink to={`/tools/s3/buckets/${bucket.name}`}>{bucket.name}</RouterLink>
                  </Cell>
                  <Cell>{bucket.status}</Cell>
                  <Cell>{statusIcons[bucket.summary?.review_status]}</Cell>
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
