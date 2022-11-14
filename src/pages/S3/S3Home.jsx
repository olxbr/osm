import { observer } from 'mobx-react-lite';
import { View } from '@adobe/react-spectrum';
import { ContentHeader } from '../../components/ContentHeader';
import { RouteCards } from '../../components';

export const S3Home = observer(() => {
  return (
    <View>
      <ContentHeader title="S3" />
      <RouteCards routeName="S3" />
    </View>
  );
});
