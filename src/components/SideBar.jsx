import React from 'react';
import { Picker, Item, Flex, Text } from '@adobe/react-spectrum';
import { NavLink, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores';
import { routes } from '../App';
import { accountList } from '../config';
import '@spectrum-css/sidenav';

export const SideBar = observer(() => {
  const { appStore } = useStores();
  const location = useLocation();

  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      const selected = location.pathname === item.path ? ' is-selected' : '';

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
          onSelectionChange={(id) => appStore.setAccount(id)}
          flex>
          {accountList.map((account) => {
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
