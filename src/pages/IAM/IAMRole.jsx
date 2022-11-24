import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useHistory } from 'react-router-dom';
import { ActionButton, Text, View, Well, Flex, Divider, Content } from '@adobe/react-spectrum';
import BackAndroid from '@spectrum-icons/workflow/BackAndroid';
import { useMsal } from '@azure/msal-react';
import { useStores } from '../../stores';
import { requestAccessToken, toDate } from '../../helpers';
import { ContentHeader } from '../../components';

export const IAMRole = observer(() => {
  const history = useHistory();
  const { instance } = useMsal();
  const { roleName } = useParams();
  const { appStore, iamStore } = useStores();

  const role = iamStore.getRole(roleName);

  console.log(role);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRoleSummary = async () => {
      setLoading(true);
      const accessToken = await requestAccessToken(instance);

      const result = await iamStore.getRoleSummary(accessToken, {
        roleName,
        account: appStore.account.id,
      });

      console.log(result);
      setLoading(false);
    };

    // getRoleSummary();
  }, [appStore, roleName, instance, iamStore]);

  return (
    <View>
      <ContentHeader>
        <ActionButton marginEnd="size-200" isQuiet onPress={history.goBack}>
          <BackAndroid />
        </ActionButton>
        <Text marginEnd="size-200">{roleName}</Text>
      </ContentHeader>

      <Well marginBottom="size-300">
        <Flex>
          <Content flex>
            <View marginBottom="size-300">
              <strong>Role ID:</strong>
              <br />
              {role.RoleId}
            </View>
            <View>
              <strong>ARN:</strong>
              <br />
              {role.Arn}
            </View>
          </Content>
          <Divider orientation="vertical" size="S" marginStart="size-300" marginEnd="size-300" />
          <Content flex>
            <View marginBottom="size-300">
              <strong>Path:</strong>
              <br />
              {role.Path}
            </View>
            <View>
              <strong>Creation Date:</strong>
              <br />
              {toDate(role.CreateDate, 'long')}
            </View>
          </Content>
        </Flex>
      </Well>
    </View>
  );
});
