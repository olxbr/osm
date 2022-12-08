import React, { useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useHistory } from 'react-router-dom';
import {
  View,
  Text,
  Button,
  ActionButton,
  Flex,
  TextArea,
  RadioGroup,
  Radio,
  DialogContainer,
  Dialog,
  Heading,
  Divider,
  Content,
  ButtonGroup,
  ProgressBar,
  Tabs,
  TabList,
  TabPanels,
  Well,
  Item,
} from '@adobe/react-spectrum';
import BackAndroid from '@spectrum-icons/workflow/BackAndroid';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import CloseCircle from '@spectrum-icons/workflow/CloseCircle';
import { useMsal } from '@azure/msal-react';
import { useStores } from '../../stores';
import { requestAccessToken } from '../../helpers';
import { ContentHeader, FormFrame, ItemNotFound } from '../../components';
import { formatJson } from '../../helpers';

export const S3Bucket = observer(() => {
  const history = useHistory();
  const { instance } = useMsal();
  const { bucketName } = useParams();
  const { appStore, s3Store } = useStores();

  const bucket = useMemo(() => {
    return s3Store.getBucketFromList(bucketName) || { name: bucketName, summary: null };
  }, [s3Store, bucketName]);

  const [compliance, setCompliance] = useState(bucket.summary?.compliance ?? '');
  const [notes, setNotes] = useState(bucket.summary?.notes ?? '');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [bucketInfo, setBucketInfo] = useState(null);
  const [loading, setLoading] = useState({ active: false, msg: 'Loading...' });

  const handleLoading = (active, msg = 'Loading...') => {
    setLoading({ active, msg });
  };

  const sendBucketSummary = async () => {
    const accessToken = await requestAccessToken(instance);

    handleLoading(true, 'Updating bucket review');
    const result = await s3Store.putBucketSummary(
      accessToken,
      {
        bucketName,
        compliance,
        notes,
      },
      { account: appStore.account.id }
    );

    if (result.message && result.message === 'success') {
      s3Store.updateBucketSummary(bucketName, {
        compliance,
        notes,
      });
      s3Store.mergeSummary();
    }

    handleLoading(false);
    setDialogOpen(true);
  };

  const statusIcons = {
    no: <CloseCircle color="negative" />,
    yes: <CheckmarkCircle color="positive" />,
  };

  useEffect(() => {
    const getBucketData = async () => {
      const accessToken = await requestAccessToken(instance);

      if (!bucket.summary) {
        handleLoading(true, 'Loading summary');

        const summaryResult = await s3Store.getBucketSummary(accessToken, {
          bucketName,
          account: appStore.account.id,
        });

        if (summaryResult) {
          setCompliance(summaryResult.compliance);
          setNotes(summaryResult.notes);
        }
      }

      if (!bucketInfo) {
        handleLoading(true, 'Get bucket data');

        const infoResult = await s3Store.getBucketInfo(accessToken, {
          bucketName,
          account: appStore.account.id,
        });

        infoResult && setBucketInfo(infoResult.bucket);
      }

      handleLoading(false);
    };

    getBucketData();
  }, [appStore, bucketName, bucketInfo, instance, s3Store, bucket]);

  return (
    <View>
      <ContentHeader>
        <ActionButton marginEnd="size-200" isQuiet onPress={history.goBack}>
          <BackAndroid />
        </ActionButton>
        <Text marginEnd="size-200">{bucketName}</Text>
        {bucket && statusIcons[compliance]}
      </ContentHeader>

      {bucket && (
        <>
          <FormFrame>
            <RadioGroup
              isRequired
              necessityIndicator="icon"
              isEmphasized
              label="Compliance"
              orientation="horizontal"
              value={compliance}
              onChange={setCompliance}>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </RadioGroup>

            <TextArea
              label="Notes"
              marginBottom="size-200"
              value={notes}
              onChange={setNotes}
              description="Enter any notes about bucket review."
            />
            <Flex>
              <Button variant="cta" onPress={sendBucketSummary} isDisabled={loading.active}>
                Update
              </Button>
            </Flex>
          </FormFrame>

          {loading.active && (
            <View padding="size-500" marginBottom="size-400">
              <Flex justifyContent="center" alignItems="center" direction="column">
                <Content marginBottom="size-100">{loading.msg}</Content>
                <ProgressBar aria-label="Loading" isIndeterminate />
              </Flex>
            </View>
          )}

          {bucketInfo && (
            <Tabs aria-label="Bucket Info">
              <TabList>
                <Item key="Status">Public Status</Item>
                <Item key="Tags">Tags</Item>
                <Item key="Policy">Policy</Item>
              </TabList>
              <TabPanels marginTop="size-300">
                <Item key="Status">
                  <table className="osm-table">
                    <tbody>
                      <tr>
                        <td>{bucketInfo.public_status}</td>
                      </tr>
                    </tbody>
                  </table>
                </Item>
                <Item key="Tags">
                  <table className="osm-table">
                    <tbody>
                      {bucketInfo.tags.map((tag) => (
                        <tr key={tag.Key}>
                          <td>{tag.Key}</td>
                          <td>{tag.Value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Item>
                <Item key="Policy">
                  <Well>
                    <pre>{formatJson(bucketInfo.policy)}</pre>
                  </Well>
                </Item>
              </TabPanels>
            </Tabs>
          )}

          <DialogContainer onDismiss={() => setDialogOpen(false)}>
            {dialogOpen && (
              <Dialog>
                <Heading>Bucket updated</Heading>
                <Divider />
                <Content>
                  <Text>
                    <strong>{bucketName}</strong> successfuly updated
                  </Text>
                </Content>
                <ButtonGroup>
                  <Button variant="secondary" onPress={() => setDialogOpen(false)}>
                    Close
                  </Button>
                </ButtonGroup>
              </Dialog>
            )}
          </DialogContainer>
        </>
      )}

      {!bucket && <ItemNotFound message="Bucket not found" />}
    </View>
  );
});
