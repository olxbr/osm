import React from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs, Item } from '@adobe/react-spectrum';
import { observer } from 'mobx-react-lite';
import { Profile } from './Profile';
import './Header.css';

export const Header = observer(() => {
  const location = useLocation();

  const renderItems = () => {
    const locationItems = location.pathname.split('/');
    return locationItems.map((item) => {
      return item === '' ? null : <Item key={item}>{item}</Item>;
    });
  };

  return (
    <header className="osm-header">
      <Breadcrumbs isDisabled flex size="M" showRoot>
        <Item key="home">home</Item>
        {renderItems()}
      </Breadcrumbs>
      <Profile />
    </header>
  );
});
