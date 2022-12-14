import { observer } from 'mobx-react-lite';
import { View } from '@adobe/react-spectrum';
import { ContentHeader } from '../../components/ContentHeader';
import { RouteCards } from '../../components';

export const IAMHome = observer(() => {
  return (
    <View>
      <ContentHeader title="IAM" />
      <RouteCards routeName="IAM" />
    </View>
  );
});
