import React from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs, Item } from '@adobe/react-spectrum';
import { observer } from 'mobx-react-lite';
import { Profile } from './Profile';
import { useStores } from '../stores';
import './Header.css';

export const Header = observer(() => {
  const { appStore } = useStores();
  const location = useLocation();

  return (
    <header className="osm-header">
      <Breadcrumbs isDisabled flex size="M">
        <Item key={appStore.account.id}>{appStore.account.name}</Item>
        <Item key={location.pathname}>{location.pathname}</Item>
      </Breadcrumbs>
      <Profile />
    </header>
  );
});
