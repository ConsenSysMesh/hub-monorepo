import React from 'react';
import type { Bot } from "@farcaster/rings-next/types";
import Title from "@farcaster/rings-next/components/title/Title";
import { useRouter } from "next/navigation";
import {
  ListItem,
} from 'tamagui';
import { ChevronRight } from "@tamagui/lucide-icons";

interface BotCardProps {
  bot: Bot;
}

const BotCard: React.FC<BotCardProps> = ({ bot, ...otherProps }) => {
  const router = useRouter();

  const channelNameString = `\\${bot.channelId}`;

  return (
    <ListItem
      key={bot.id}
      hoverTheme
      padding="$3"
      borderRadius="$2"
      borderWidth="1px"
      borderColor="$color6"
      borderStyle="solid"
      hoverStyle={{
        cursor: 'pointer'
      }}
      onPress={() => router.push(`/bot/${bot.id}`)}
      {...otherProps}
    >
      <Title>
        <Title.Avatar size="$3" source={bot.channelImageUrl} />
        <Title.Group>
          <Title.Heading size="$2">{bot.botName}</Title.Heading>
          <Title.Heading size="$1" color="$color11">{channelNameString}</Title.Heading>
        </Title.Group>
      </Title>

      <ChevronRight />
    </ListItem>
  );
}

export default BotCard;