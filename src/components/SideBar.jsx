import React from 'react';
import { Picker, Item, Flex, Text } from '@adobe/react-spectrum';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { osmConfig } from '../config';

export const SideBar = observer(() => {
  const { awsAccounts } = osmConfig;

  return (
    <div className="osm-sidebar">
      <h2 className="logo">Olx<br />Security<br />Manager</h2>

      <Flex marginBottom="size-500">
        <Picker aria-label="Account" label="AWS Account" flex>
          {awsAccounts.map(account => {
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
          <li className="spectrum-SideNav-item is-selected">
            <Link to="/">Home</Link>
          </li>
          <li className="spectrum-SideNav-item">
            <Link to="/s3-tools">S3 Tools</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
});
