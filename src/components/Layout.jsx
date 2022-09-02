import React from "react";
import { Flex, View } from "@adobe/react-spectrum";
import { observer } from "mobx-react-lite";
import { SideBar, Header } from "./";

export const Layout = observer((props) => {
  return (
    <Flex direction="row" height="100vh">
      <View backgroundColor="gray-200" width="size-3000" padding="size-300">
        <SideBar />
      </View>
      <Flex direction="column" flex>
        <View paddingY="size-200" paddingX="size-400">
          <Header />
        </View>
        <View paddingY="size-200" paddingX="size-400" flex>
          <main>
            {props.children}
          </main>
        </View>
      </Flex>
    </Flex>
  )
});
