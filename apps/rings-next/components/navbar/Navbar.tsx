import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Popover,
  PopoverTrigger,
  Text,
  View,
  styled,
  useEvent,
} from 'tamagui';
import Title from "@farcaster/rings-next/components/title/Title";
import { useAuth } from "@farcaster/rings-next/provider/AuthProvider";
import { useSignIn } from "@farcaster/auth-kit";
import Logo from "@farcaster/rings-next/components/logo/Logo";

interface NavbarProps {
  title?: string | React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const [triggerOpen, setTriggerOpen] = useState(false);
  const closeTrigger = useEvent(() => {
    setTriggerOpen(false)
  });

  return (
    <View
      flexDirection="row"
      paddingHorizontal={12}
      paddingVertical="$2"
      width="100%"
      tag="nav"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="$background"
      $group-window-sm={{ paddingHorizontal: 8 }}
      gap="$3"
      borderBottomWidth={1}
      borderBottomColor="$gray4"
    >
      {title || (
        <Title>
          <Logo size={36} marginRight="$2" />
          <Title.Heading>tipster.bot</Title.Heading>
        </Title>
      )}

      <View flexDirection="row" alignItems="center" gap="$3">
        <ProfileDropdown
          triggerOpen={triggerOpen}
          setTriggerOpen={setTriggerOpen}
          closeTrigger={closeTrigger}
        />
      </View>
    </View>
  )
};

interface ProfileDropdownProps {
  triggerOpen: boolean;
  setTriggerOpen: (open: boolean) => void;
  closeTrigger: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps>  = ({ triggerOpen, setTriggerOpen, closeTrigger }) => {
  const { logout, session } = useAuth();
  const { signOut } = useSignIn({});

  const handleSignOut= () => {
    signOut();
    logout();
    closeTrigger();
  };

  return (
    <Popover
      offset={{
        mainAxis: 5,
      }}
      placement="bottom-end"
      open={triggerOpen}
      onOpenChange={setTriggerOpen}
    >
      <PopoverTrigger asChild>
        <Button circular chromeless>
          <Avatar circular size="$3">
            <Avatar.Image
              pointerEvents="none"
              aria-label="user photo"
              source={session?.pfpUrl}
            />
            <Avatar.Fallback backgroundColor="$gray10" />
          </Avatar>
        </Button>
      </PopoverTrigger>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        backgroundColor="$color1"
        padding={0}
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        elevation={5}
        overflow="hidden"
      >
        <DropDownItem onPress={handleSignOut}>
          <DropDownText>Sign Out</DropDownText>
        </DropDownItem>
      </Popover.Content>
    </Popover>
  )
};

const DropDownItem = styled(View, {
  backgroundColor: '$background',
  width: '100%',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
  },
  pressStyle: {
    backgroundColor: '$backgroundPress',
  },
  cursor: 'pointer',
  paddingHorizontal: '$4',
  paddingVertical: '$2',
  alignItems: 'center',
  justifyContent: 'center',
  '$group-window-xs': {
    paddingHorizontal: '$2',
    paddingVertical: '$1',
  },
});

const DropDownText = styled(Text, {
  fontWeight: '$2',
  lineHeight: '$2',
  fontSize: '$2',
  '$group-window-xs': {
    fontWeight: '$1',
    fontSize: '$1',
    lineHeight: '$1',
  },
});

export default Navbar;
