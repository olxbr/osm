import { observer } from 'mobx-react-lite';
import { View } from '@adobe/react-spectrum';
import { ContentHeader } from '../../components/ContentHeader';
import { RouteCards } from '../../components';

export const EC2Home = observer(() => {
  return (
    <View>
      <ContentHeader title="EC2" />
      <RouteCards routeName="EC2" />
    </View>
  );
});
