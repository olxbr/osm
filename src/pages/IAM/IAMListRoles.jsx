import React, { useState } from 'react';
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
import { ContentHeader } from '../../components';
import { observer } from 'mobx-react-lite';
import { useMsal } from '@azure/msal-react';
import { useStores } from '../../stores';
import { requestAccessToken, toDate } from '../../helpers';

export const IAMListRoles = observer(() => {
  const { instance } = useMsal();
  const { appStore, iamStore } = useStores();
  const { roles, updatedAt } = iamStore.listRolesData;

  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState({ active: false, msg: 'Loading...' });

  const handleLoading = (active, msg = 'Loading...') => {
    setLoading({ active, msg });
  };

  const listRoles = async (mode = 'latest') => {
    setDone(false);
    handleLoading(
      true,
      `${mode === 'latest' ? 'Listing' : 'Updating'} ${appStore.account.name} roles...`
    );
    iamStore.resetListRolesData();

    const accessToken = await requestAccessToken(instance);

    const listResult = await iamStore.listRoles(accessToken, {
      account: appStore.account.id,
      mode,
    });

    // handleLoading(true, 'Get summary data...');
    // const summaryResult = await iamStore.listRolesSummary(accessToken, {
    //   account: appStore.account.id,
    // });

    iamStore.setListRolesData(listResult);

    // iamStore.setRolesSummary({
    //   account: appStore.account.id,
    //   roles: summaryResult,
    // });
    // iamStore.mergeSummary();

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
      <ContentHeader title="IAM Roles" />
      <View
        borderRadius="regular"
        paddingX="size-300"
        paddingY="size-200"
        backgroundColor="gray-200"
        marginBottom="size-400">
        <View marginBottom="size-300">
          {appStore.account.id === 'allAccounts' ? (
            <Text>Select an Account in the Sidebar to list roles *</Text>
          ) : (
            <Text>
              Current Account: <strong>{appStore.account.name}</strong>
            </Text>
          )}
        </View>

        <View marginBottom="size-200">
          <Button
            variant="cta"
            onPress={() => listRoles()}
            isDisabled={appStore.account.id === 'allAccounts'}>
            <Text>List Roles</Text>
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

      {roles.length > 0 && (
        <Flex justifyContent="space-between" alignItems="center" marginBottom="size-300">
          <Text>
            <strong>{roles.length}</strong> items
          </Text>
          <Flex alignItems="center">
            <Text marginEnd="size-200">
              <strong>Last update:</strong> {toDate(updatedAt, 'medium')}
            </Text>
            <ActionButton onPress={() => listRoles('update')}>
              <Refresh />
              <Text>Update</Text>
            </ActionButton>
          </Flex>
        </Flex>
      )}

      {roles.length > 0 && (
        <TableView
          // selectionMode="single"
          // selectedKeys={selectedKeys}
          // onSelectionChange={setSelectedKeys}
          marginBottom="size-400"
          aria-label={`${appStore.account.name} buckets`}>
          <TableHeader>
            <Column key="name" align="start">
              Name
            </Column>
            <Column key="creation_date" align="end">
              Creation Date
            </Column>
          </TableHeader>
          <TableBody>
            {roles.map((role) => {
              return (
                <Row key={role.RoleName}>
                  <Cell>
                    <RouterLink to={`/tools/iam/roles/${role.RoleName}`}>
                      {role.RoleName}
                    </RouterLink>
                  </Cell>
                  <Cell>{toDate(role.CreateDate)}</Cell>
                </Row>
              );
            })}
          </TableBody>
        </TableView>
      )}

      {done && roles.length <= 0 && (
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
