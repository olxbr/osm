import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ContentHeader } from '../components/ContentHeader';
import { observer } from 'mobx-react-lite';
import { routes } from '../routes';
import { View, Heading, Text, Link } from '@adobe/react-spectrum';

const renderCategories = (routes) => {
  return routes.map((route) => {
    if (route.name === 'Home') {
      return '';
    }

    if (route.isHeader) {
      return (
        <div key={route.name} style={{ marginBottom: '50px' }}>
          <Heading level={3}>{route.name}</Heading>
          {route.items?.length > 0 && renderCategories(route.items)}
        </div>
      );
    }

    return (
      <div key={route.name} style={{ marginBottom: '15px' }}>
        <Link>
          <RouterLink to={route.path}>{route.name}</RouterLink>
        </Link>
        <br />
        <Text>{route.description}</Text>
      </div>
    );
  });
};

export const Home = observer(() => {
  return (
    <View>
      <ContentHeader title="Home" />
      {renderCategories(routes)}
    </View>
  );
});
