import React, { useState } from "react";
import { Heading, Divider, ActionButton } from "@adobe/react-spectrum";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../stores";

export const S3Tools = observer(() => {
  const [data, setData] = useState(null);

  const { s3ToolsStore } = useRootStore();

  const handleS3Data = async () => {
    const result = await s3ToolsStore.fetchS3Tools();
    setData(result);
  }

  return (
    <div className="osm-s3-tool">
      <Heading level={2}>S3 Tools</Heading>
      <Divider size="M" marginBottom="size-400" />

      <div className="osm-box">
        <ActionButton onPress={handleS3Data}>Call S3 Tool</ActionButton><br />
        {data &&
          <code>
            <strong>message:</strong><br />
            {data.message}
          </code>}
      </div>
    </div>
  )
});
