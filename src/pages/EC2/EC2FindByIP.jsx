import { observer } from 'mobx-react-lite';
import { View } from '@adobe/react-spectrum';
import { ContentHeader } from '../../components/ContentHeader';

export const EC2FindByIP = observer(() => {
  return (
    <View>
      <ContentHeader title="Find EC2/ELB by IP" />
    </View>
  );
});
