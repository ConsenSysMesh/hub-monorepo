import React from 'react';
import {
  Heading,
  Avatar,
  XStack,
  YStack,
  View,
  styled,
  withStaticProperties,
  useProps,
  Button,
} from "tamagui";
import type { AvatarProps, ButtonProps, HeadingProps } from 'tamagui';
import { ImageSourcePropType } from 'react-native';
import { ArrowLeft } from "@tamagui/lucide-icons";

interface TitleAvatarProps extends AvatarProps {
  source?: ImageSourcePropType,
}

const TitleAvatar: React.FC<TitleAvatarProps> = (props) => {
  const {
    size = '$5',
    source,
  } = useProps(props);

  return (
    <View ai="center" jc="center" mr="$2">
      <Avatar circular size={size}>
        <Avatar.Image
          pointerEvents="none"
          aria-label="user photo"
          source={source}
        />
        <Avatar.Fallback backgroundColor="$gray10" />
      </Avatar>
    </View>
  );
};

interface TitleButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

const TitleButton: React.FC<TitleButtonProps> = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Button
      chromeless
      icon={ArrowLeft}
      marginRight="$2"
      {...otherProps}
    >
      {children}
    </Button>
  );
};

interface TitleHeadingProps extends HeadingProps {
  children?: React.ReactNode;
}

const TitleHeading: React.FC<TitleHeadingProps> = (props) => {
  const {
    children,
    ...otherProps
  } = useProps(props);

  return (
    <Heading { ...otherProps} textTransform="none">
      {children}
    </Heading>
  )
};

export const TitleFrame = styled(XStack, {
  alignItems: 'center',
});

export const TitleGroup = styled(YStack, {
  alignItems: 'flex-start',
});

export const Title = withStaticProperties(TitleFrame, {
  Avatar: TitleAvatar,
  Button: TitleButton,
  Heading: TitleHeading,
  Group: TitleGroup,
});

export default Title;
