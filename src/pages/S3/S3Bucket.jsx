import React, { useState, useEffect } from 'react';
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
  ProgressCircle,
} from '@adobe/react-spectrum';
import BackAndroid from '@spectrum-icons/workflow/BackAndroid';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import AlertCircleFilled from '@spectrum-icons/workflow/AlertCircleFilled';
import CloseCircle from '@spectrum-icons/workflow/CloseCircle';
import { useMsal } from '@azure/msal-react';
import { useStores } from '../../stores';
import { requestAccessToken } from '../../helpers';
import { ContentHeader, FormFrame, ItemNotFound } from '../../components';

export const S3Bucket = observer(() => {
  const history = useHistory();
  const { instance } = useMsal();
  const { bucketName } = useParams();
  const { appStore, s3Store } = useStores();

  const bucket = s3Store.getBucket(bucketName);

  const [reviewStatus, setReviewStatus] = useState(bucket?.summary?.review_status ?? '');
  const [notes, setNotes] = useState(bucket?.summary?.notes ?? '');
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const sendBucketSummary = async () => {
    setLoading(true);
    const accessToken = await requestAccessToken(instance);

    const result = await s3Store.putBucketSummary(
      accessToken,
      {
        bucketName,
        reviewStatus,
        notes,
      },
      { account: appStore.account.id }
    );

    if (result.message && result.message === 'success') {
      s3Store.updateBucketSummary(bucketName, {
        review_status: reviewStatus,
        notes,
      });
      s3Store.mergeSummary();
    }

    console.log(result);
    setLoading(false);
    setDialogOpen(true);
  };

  const statusIcons = {
    notReviewed: <CloseCircle color="negative" />,
    withCaveats: <AlertCircleFilled color="notice" />,
    reviewed: <CheckmarkCircle color="positive" />,
  };

  useEffect(() => {
    const getBucketSummary = async () => {
      setLoading(true);
      const accessToken = await requestAccessToken(instance);

      const result = await s3Store.getBucketSummary(accessToken, {
        bucketName,
        account: appStore.account.id,
      });

      console.log(result);
      setLoading(false);
    };

    getBucketSummary();
  }, [appStore, bucketName, instance, s3Store]);

  return (
    <View>
      <ContentHeader>
        <ActionButton marginEnd="size-200" isQuiet onPress={history.goBack}>
          <BackAndroid />
        </ActionButton>
        <Text marginEnd="size-200">{bucketName}</Text>
        {bucket && statusIcons[reviewStatus]}
      </ContentHeader>

      {bucket && (
        <>
          <FormFrame>
            <RadioGroup
              isRequired
              necessityIndicator="icon"
              isEmphasized
              label="Review Status"
              orientation="horizontal"
              value={reviewStatus}
              onChange={setReviewStatus}>
              <Radio value="notReviewed">Without review</Radio>
              <Radio value="withCaveats">Reviewed with caveats</Radio>
              <Radio value="reviewed">Reviewed</Radio>
            </RadioGroup>

            <TextArea
              label="Notes"
              marginBottom="size-200"
              value={notes}
              onChange={setNotes}
              description="Enter any notes about bucket review."
            />
            <Flex>
              <Button variant="cta" onPress={sendBucketSummary} isDisabled={loading}>
                Send
              </Button>
              {loading && <ProgressCircle aria-label="Loading…" size="M" isIndeterminate />}
            </Flex>
          </FormFrame>

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
