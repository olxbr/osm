import React from 'react';
import { View, Heading, Divider, Flex } from '@adobe/react-spectrum';
import { observer } from 'mobx-react-lite';

export const ContentHeader = observer((props) => {
  return (
    <View marginBottom="size-400">
      <Heading level={2}>
        <Flex alignItems="center" alignContent="center">
          {props.title ? props.title : props.children}
        </Flex>
      </Heading>
      <Divider size="M" />
    </View>
  );
});
