import React, { useEffect } from 'react';
import { Picker, Item, Flex, Text } from '@adobe/react-spectrum';
import { NavLink, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useMsal } from '@azure/msal-react';
import { useStores } from '../stores';
import { routes } from '../routes';
import { requestAccessToken } from '../helpers';
import '@spectrum-css/sidenav';

export const SideBar = observer(() => {
  const { instance } = useMsal();
  const { appStore, s3Store, iamStore } = useStores();
  const location = useLocation();

  useEffect(() => {
    const getAccountList = async () => {
      const accessToken = await requestAccessToken(instance);
      appStore.fetchAccounts(accessToken);
    };

    getAccountList();
  }, [appStore, instance]);

  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      const selected = location.pathname === item.path ? ' is-selected' : '';

      if (item.isHidden) {
        return '';
      }

      if (!item.isHeader) {
        return (
          <li className={`spectrum-SideNav-item${selected}`} key={item.name}>
            <NavLink className="spectrum-SideNav-itemLink" to={item.path}>
              {item.name}
            </NavLink>
            {item.items?.length > 0 && (
              <ul className="spectrum-SideNav">{renderMenuItems(item.items)}</ul>
            )}
          </li>
        );
      }

      if (item.isHeader) {
        return (
          <li className="spectrum-SideNav-item" key={item.name}>
            <h2 className="spectrum-SideNav-heading" id={`nav-heading-category-${index}`}>
              {item.name}
            </h2>
            <ul
              className="spectrum-SideNav spectrum-SideNav--multiLevel"
              aria-labelledby={`nav-heading-category-${index}`}>
              {renderMenuItems(item.items)}
            </ul>
          </li>
        );
      }

      return '';
    });
  };

  const handleAccountChange = (accountId) => {
    appStore.setAccount(accountId);
    s3Store.resetListBucketsData();
    s3Store.resetFindBucketData();
    iamStore.resetListRolesData();
  };

  return (
    <div className="osm-sidebar">
      <h2 className="logo">
        Olx
        <br />
        Security
        <br />
        Manager
      </h2>

      <Flex marginBottom="size-500">
        <Picker
          aria-label="AWS Account"
          label="AWS Account"
          defaultSelectedKey={appStore.account.id}
          onSelectionChange={(id) => handleAccountChange(id)}
          flex>
          {appStore.accounts.map((account) => {
            return (
              <Item key={account.id} textValue={account.name}>
                <Text>{account.name}</Text>
                <Text slot="description">{account.id}</Text>
              </Item>
            );
          })}
        </Picker>
      </Flex>

      <nav>
        <ul className="spectrum-SideNav">{renderMenuItems(routes)}</ul>
      </nav>
    </div>
  );
});
