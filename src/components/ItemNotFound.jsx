import { Heading, IllustratedMessage } from '@adobe/react-spectrum';
import NotFound from '@spectrum-icons/illustrations/NotFound';

export const ItemNotFound = ({ message }) => {
  return (
    <IllustratedMessage marginTop="size-400">
      <NotFound />
      <Heading>{message}</Heading>
    </IllustratedMessage>
  );
};
