import React from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumbs, Item } from "@adobe/react-spectrum";
import { observer } from "mobx-react-lite";
import { Profile } from "./Profile";
import "./Header.css";

export const Header = observer(() => {
  const location = useLocation();

  return (
    <header className="osm-header">
      <Breadcrumbs isDisabled flex size="M">
        <Item key="home">Home</Item>
        <Item key={location.pathname}>{location.pathname}</Item>
      </Breadcrumbs>
      <Profile />
    </header>
  )
});
