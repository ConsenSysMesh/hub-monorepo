import {
  YStack,
  Card,
  Paragraph,
} from "tamagui";
import React from "react";
import type { Bot } from '@tipster/next/types';
import BotCard from "@tipster/next/components/bot/BotCard";

interface BotListProps {
  bots: Bot[];
}

export const BotList: React.FC<BotListProps> = ({ bots, ...otherProps }) => (
  <YStack
    gap="$4"
    {...otherProps}
  >
    {(!bots || bots.length === 0) &&
      <Card padding="$3">
        <Paragraph fontWeight="bold">Welcome! You don&apos;t have any tipbots yet.</Paragraph>
        <Paragraph color="$color11">No worries you can go from noob to first bot in just few minutes. LFG! 🚀</Paragraph>
      </Card>
    }

    {bots.map(bot => <BotCard key={bot.id} bot={bot} />)}
  </YStack>
);

export default BotList;
