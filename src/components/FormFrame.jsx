import { observer } from 'mobx-react-lite';
import { View, Form } from '@adobe/react-spectrum';

export const FormFrame = observer((props) => {
  return (
    <View
      borderRadius="regular"
      paddingX="size-300"
      paddingY="size-200"
      backgroundColor="gray-200"
      marginBottom="size-300">
      <Form marginBottom="size-300" onSubmit={(e) => e.preventDefault()}>
        {props.children}
      </Form>
    </View>
  );
});
