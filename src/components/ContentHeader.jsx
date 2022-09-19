import React from 'react';
import { View, Heading, Divider } from '@adobe/react-spectrum';
import { observer } from 'mobx-react-lite';

export const ContentHeader = observer(({ title }) => {
  return (
    <View marginBottom="size-400">
      <Heading level={2}>{title}</Heading>
      <Divider size="M" />
    </View>
  );
});
