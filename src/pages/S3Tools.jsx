import React, { useState } from "react";
import {
  Heading,
  Divider,
  Button,
  TextField,
  Form,
  ButtonGroup
} from "@adobe/react-spectrum";
import { observer } from "mobx-react-lite";
import { useStores } from "../stores";

export const S3Tools = observer(() => {
  const { appStore, s3ToolsStore } = useStores();
  const [data, setData] = useState(null);
  const [bucketName, setBucketName] = useState("");

  const params = { bucketName };

  const handleS3Data = async (fn) => {
    const result = await s3ToolsStore.fetchS3Tools({
      account: appStore.account.id,
      fn,
      ...params
    });
    console.log(result);
    setData(result);
  }

  return (
    <div className="osm-s3-tool">
      <Heading level={2}>S3 Tools</Heading>
      <Divider size="M" marginBottom="size-400" />

      <div className="osm-box">
        <Form marginBottom="size-200">
          <TextField
            label="Bucket Name"
            value={bucketName}
            onChange={setBucketName} />
        </Form>
        <div className="osm-box">
          <ButtonGroup>
            <Button
              variant="primary"
              onPress={() => handleS3Data("find-bucket")}
            >
              Call Find Bucket
            </Button>
            <Button
              variant="primary"
              onPress={() => handleS3Data("check-acls")}
            >
              Call Check ACLs
            </Button>
          </ButtonGroup>
        </div>
        {data &&
          <code>
            account: {data?.event.queryStringParameters.account}<br />
            fn: {data?.event.queryStringParameters.fn}<br />
            bucketName: {data?.event.queryStringParameters.bucketName}
          </code>}
      </div>
    </div>
  )
});
