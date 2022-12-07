import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useCollator } from 'react-aria';
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
  Link,
  useAsyncList,
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
import { requestAccessToken, toDate } from '../../helpers';

export const S3ListBuckets = observer(() => {
  const { instance } = useMsal();
  const collator = useCollator({ numeric: true });
  const { appStore, s3Store } = useStores();
  const { buckets, updatedAt } = s3Store.listBucketsData;

  const bucketList = useAsyncList({
    async load({ signal }) {
      return { items: buckets };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          let cmp = collator.compare(a[sortDescriptor.column], b[sortDescriptor.column]);
          if (sortDescriptor.direction === 'descending') {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState({ active: false, msg: 'Loading...' });

  const handleLoading = (active, msg = 'Loading...') => {
    setLoading({ active, msg });
  };

  const listBuckets = async (mode = 'latest') => {
    setDone(false);
    handleLoading(
      true,
      `${mode === 'latest' ? 'Listing' : 'Updating'} ${appStore.account.name} buckets...`
    );
    s3Store.resetListBucketsData();

    const accessToken = await requestAccessToken(instance);

    const listResult = await s3Store.listBuckets(accessToken, {
      account: appStore.account.id,
      mode,
    });

    handleLoading(true, 'Get review data...');
    const summaryResult = await s3Store.listBucketsSummary(accessToken, {
      account: appStore.account.id,
    });

    s3Store.setListBucketsData(listResult);
    s3Store.setBucketsSummary({
      account: appStore.account.id,
      buckets: summaryResult,
    });
    s3Store.mergeSummary();

    setDone(true);
    handleLoading(false);

    window.location.reload(); // TODO: Remove this quirk fix for empty list
  };

  const statusIcons = {
    notReviewed: <CloseCircle color="negative" size="S" />,
    withCaveats: <AlertCircleFilled color="notice" size="S" />,
    reviewed: <CheckmarkCircle color="positive" size="S" />,
  };

  const renderColumn = (key, item) => {
    if (key === 'name') {
      return (
        <Cell>
          <Link isQuiet>
            <RouterLink to={`/tools/s3/buckets/${item[key]}`}>{item[key]}</RouterLink>
          </Link>
          {}
        </Cell>
      );
    }

    if (key === 'reviewStatus') {
      return <Cell>{statusIcons[item.reviewStatus]}</Cell>;
    }

    if (key === 'creation_date') {
      return <Cell>{new Date(item.creation_date).toLocaleString()}</Cell>;
    }

    return <Cell>{item[key]}</Cell>;
  };

  return (
    <View>
      <ContentHeader title="S3 Buckets" />
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

        <View marginBottom="size-100">
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
            <strong>{buckets.length}</strong> items
          </Text>
          <Flex alignItems="center">
            <Text marginEnd="size-200">
              <strong>Last update:</strong> {toDate(updatedAt, 'medium')}
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
          sortDescriptor={bucketList.sortDescriptor}
          onSortChange={bucketList.sort}
          marginBottom="size-400"
          aria-label={`${appStore.account.name} buckets`}>
          <TableHeader>
            <Column key="name" align="start" allowsSorting>
              Bucket Name
            </Column>
            <Column key="reviewStatus" align="center" allowsSorting>
              Reviewed
            </Column>
            <Column key="creation_date" align="end" allowsSorting>
              Creation Date
            </Column>
          </TableHeader>
          <TableBody items={bucketList.items} loadingState={bucketList.loadingState}>
            {(item) => <Row key={item.name}>{(key) => renderColumn(key, item)}</Row>}
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
