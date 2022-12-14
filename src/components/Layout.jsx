import React from 'react';
import { Flex, View } from '@adobe/react-spectrum';
import { observer } from 'mobx-react-lite';
import { SideBar, Header } from './';

export const Layout = observer((props) => {
  return (
    <Flex direction="row" height="100vh" gap="size-0">
      <View
        backgroundColor="gray-200"
        width="size-3000"
        minWidth="size-2400"
        padding="size-300"
        overflow="auto">
        <SideBar />
      </View>
      <Flex direction="column" gap="size-0" flex>
        <View
          paddingY="size-200"
          paddingX="size-400"
          borderBottomWidth={1}
          borderBottomColor="gray-200">
          <Header />
        </View>
        <View paddingY="size-200" paddingX="size-400" flex overflow="auto">
          <main>{props.children}</main>
        </View>
      </Flex>
    </Flex>
  );
});
