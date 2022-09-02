import React from "react";
import { Flex, View, Button, Text } from "@adobe/react-spectrum";
import Login from '@spectrum-icons/workflow/Login';
import { observer } from "mobx-react-lite";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config";

export const SignIn = observer(() => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch(e => console.log(e));
  }

  return (
    <Flex direction="row" height="100vh">
      <View padding="size-500">
        <h1 className="logo">Olx<br />Security<br />Manager</h1>
        <Button variant="cta" onPress={handleLogin}>
          <Login />
          <Text>Sign-in</Text>
        </Button>
      </View>
    </Flex>
  )
});
