import React from 'react';
import { Picker, Item, Flex, Text } from '@adobe/react-spectrum';
import { NavLink, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores';
import { routes } from '../App';
import '@spectrum-css/sidenav';

export const SideBar = observer(() => {
  const { appStore } = useStores();
  const location = useLocation();

  return (
    <div className="osm-sidebar">
      <h2 className="logo">Olx<br />Security<br />Manager</h2>

      <Flex marginBottom="size-500">
        <Picker
          aria-label="AWS Account"
          label="AWS Account"
          defaultSelectedKey={appStore.account.id}
          onSelectionChange={id => appStore.setAccount(id)}
          flex
        >
          {appStore.awsAccounts.map(account => {
            return (
              <Item key={account.id} textValue={account.name}>
                <Text>{account.name}</Text>
                <Text slot="description">{account.id}</Text>
              </Item>
            )
          })}
        </Picker>
      </Flex>

      <nav>
        <ul className="spectrum-SideNav">
          {routes.map(item => {
            const selected = location.pathname === item.path ? " is-selected" : "";
            return (
              <li className={`spectrum-SideNav-item${selected}`} key={item.name}>
                <NavLink className="spectrum-SideNav-itemLink" to={item.path}>
                  {item.name}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
});
