import React from "react";
import {
  MenuTrigger,
  ActionButton,
  Menu,
  Item,
  Section
} from '@adobe/react-spectrum';
import User from '@spectrum-icons/workflow/User';
import Light from '@spectrum-icons/workflow/Light';
import Moon from '@spectrum-icons/workflow/Moon';
import { observer } from "mobx-react-lite";
import { useMsal } from "@azure/msal-react";
import { useRootStore } from "../stores";
import './Profile.css';

export const Profile = observer(() => {
  const { instance, accounts } = useMsal();
  const { uiStore } = useRootStore();

  const logout = () => {
    instance.logoutRedirect({ postLogoutRedirectUri: "/" });
  }

  const handleKey = (key) => {
    if (key === "sign-out") {
      logout();
    }
  }

  const toggleColorScheme = () => {
    uiStore.colorScheme === "light"
      ? uiStore.setColorScheme("dark")
      : uiStore.setColorScheme("light");
  }

  return (
    <div className="osm-profile">
      <MenuTrigger align="end">
        <ActionButton>
          <User />
        </ActionButton>
        <Menu onAction={(key) => handleKey(key)} disabledKeys={['email']}>
          <Section title="User">
            <Item key="email">{accounts[0].username}</Item>
            <Item key="sign-out">Sign-out</Item>
          </Section>
        </Menu>
      </MenuTrigger>
      <ActionButton marginStart="size-100" onPress={toggleColorScheme}>
        {uiStore.colorScheme === "light" ? <Moon /> : <Light />}
      </ActionButton>
    </div>
  );
});
