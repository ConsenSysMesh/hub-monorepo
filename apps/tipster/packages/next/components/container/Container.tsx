import { YStack } from 'tamagui';
import config from "@tipster/next/tamagui.config";

const DEFAULT_WIDTH = config.media.lg.maxWidth;
const DEFAULT_MAX_WIDTH = '600px';

interface ContainerProps {
  children: React.ReactNode;
  outerProps?: object;
  innerProps?: object;
}

const Container: React.FC<ContainerProps> = (props) => {
  const {
    children,
    outerProps = {},
    innerProps = {},
  } = props;

  return (
    <YStack
      justifyContent="center"
      alignItems="center"
      padding="$5"
      {...outerProps}
    >
      <YStack
        maxWidth={DEFAULT_MAX_WIDTH}
        width={DEFAULT_WIDTH}

        $xxs={{ width: '100%' }}
        $xs={{ width: config.media.xxs.maxWidth }}
        {...innerProps}
      >
        {children}
      </YStack>
    </YStack>
  )
}

export default Container;
