import React from 'react';
import { ContentHeader } from '../components/ContentHeader';
import { observer } from 'mobx-react-lite';
import { View } from '@adobe/react-spectrum';
import { RouteCards } from '../components';
import '@spectrum-css/card';

export const Home = observer(() => {
  return (
    <View>
      <ContentHeader title="Home" />
      <RouteCards />
    </View>
  );
});
