import React from 'react';
import { ContentHeader } from '../components/ContentHeader';
import { observer } from 'mobx-react-lite';

export const Home = observer(() => {
  return <ContentHeader title="Home" />;
});
