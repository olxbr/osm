import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useMsal } from "@azure/msal-react";
import { loginRequest, osmConfig } from "../../config";
import './style.css';

const callS3Tool = async (accessToken) => {
  let result = "";
  try {
    const resp = await fetch(`${osmConfig.apiUrl}/s3-tool`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    result = await resp.json();
  } catch (err) {
    console.log(err);
  }
  return result;
}

export const S3Tool = observer(() => {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState(null);
  const [s3Data, setS3Data] = useState(null);

  const handleS3Data = async () => {
    const result = await callS3Tool(accessToken);
    setS3Data(result);
  }

  const RequestAccessToken = () => {
    const request = {
        ...loginRequest,
        account: accounts[0]
    };

    instance.acquireTokenSilent(request).then((response) => {
        setAccessToken(response.accessToken);
    }).catch((e) => {
        instance.acquireTokenPopup(request).then((response) => {
            setAccessToken(response.accessToken);
        });
    });
  }

  return (
    <div className="osm-s3-tool">
      <p>s3-tool</p>

      <div className="box">
        <button onClick={RequestAccessToken}>Request Access Token</button><br />
        {accessToken &&
          <>
            <strong>token acquired:</strong><br />
            {`${accessToken.substring(0, 32)} ...`}
          </>}
      </div>
      {accessToken &&
        <div className="box">
          <button onClick={handleS3Data}>Call S3 Tool</button><br />
          {s3Data &&
            <>
              <strong>message:</strong><br />
              {s3Data.message}
            </>}
        </div>}
    </div>
  )
});
