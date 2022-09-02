import React from "react";
import { Heading, Divider } from "@adobe/react-spectrum";
import { observer } from "mobx-react-lite";

export const Home = observer(() => {
  return (
    <div className="osm-home">
      <Heading level={2}>Home</Heading>
      <Divider size="M" marginBottom="size-400" />
    </div>
  )
});
