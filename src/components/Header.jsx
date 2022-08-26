import React from "react";
import { observer } from "mobx-react-lite";
import { Profile } from "./Profile";

export const Header = observer(() => {
  return (
    <header className="osm-header">
      <p>header</p>
      <Profile />
    </header>
  )
});
