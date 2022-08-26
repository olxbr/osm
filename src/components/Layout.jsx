import React from "react";
import { observer } from "mobx-react-lite";
import { SideBar, Header } from "./";

export const Layout = observer((props) => {
  return (
    <div className="app">
      <Header />
      <SideBar />
      <div className="main-content">
        {props.children}
      </div>
    </div>
  )
});
