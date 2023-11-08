import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';

const useIsTrustyAIAvailable = () => {
  const { status } = useIsAreaAvailable(SupportedArea.TRUSTY_AI);

  return [status];
};

export default useIsTrustyAIAvailable;
