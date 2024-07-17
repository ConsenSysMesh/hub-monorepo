import React from 'react';
import { Button, ListItem, Paragraph } from "tamagui";
import Title from "@tipster/next/components/title/Title";
import { CheckCircle, Share } from "@tamagui/lucide-icons";
import { User } from "@tipster/next/types";
import Tooltip from "@tipster/next/components/tooltip/Tooltip";

interface BotPointCardProps {
  user: User;
  index: number;
}

const BotEligibility = () => {
  return (
    <Tooltip placement="top-end" content={<Paragraph>Eligible to give tips</Paragraph>}>
      <CheckCircle marginLeft="$1" color="$green10" size={14} />
    </Tooltip>
  )
};

const BotPointCard: React.FC<BotPointCardProps> = (props) => {
  const { user, index } = props;

  const onCardPress = () => {
    window.open(`https://warpcast.com/${user.username}`, '_blank');
  }

  return (
    <ListItem
      padding="$3"
      gap="$3"
      alignItems="center"
      borderRadius="$2"
      borderColor="$color6"
      borderWidth="1px"
      borderStyle="solid"
    >
      <Paragraph marginRight="$3">{index + 1}</Paragraph>
      <Title marginRight="auto">
        <Title.Avatar size="$3" source={user.pfpUrl} />
        <Title.Group>
          <Title.Heading
            size="$2"
            alignItems="center"
            display="flex">{user.displayName} {user.isEligible && <BotEligibility />}</Title.Heading>
          <Title.Heading size="$1" color="$color11">{`@${user.username}`}</Title.Heading>
        </Title.Group>
      </Title>

      <Paragraph marginRight="auto">{user.balance}</Paragraph>

      <Tooltip
        placement="top-end"
        content={(
          <Paragraph>Open Profile in Warpcast</Paragraph>
        )}
      >
        <Button onPress={onCardPress} icon={Share} chromeless />
      </Tooltip>
    </ListItem>
  )
};

export default BotPointCard;

