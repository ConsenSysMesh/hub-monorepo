'use client';
import { XStack, useMedia } from 'tamagui';
import { useParams, useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Navbar from "@tipster/next/components/navbar/Navbar";
import Title from "@tipster/next/components/title/Title";
import { useSelector } from "react-redux";
import { selectBotsById } from "@tipster/next/state/bots/selectors";
import {useBotActions} from "@tipster/next/hooks/useBotActions";
import {useLeaderboardActions} from "@tipster/next/hooks/useLeaderboardActions";
import Container from "@tipster/next/components/container/Container";
import data from "@tipster/next/data";
import UnderlineTabs, { Tab } from "@tipster/next/components/tabs/UnderlineTabs";
import { Cog, Grid } from '@tamagui/lucide-icons';
import {IS_USING_MOCK_DATA} from "@tipster/next/constants";

type Params = { id: string }

interface BotTab extends Tab {
  path: string;
}

export default function BotLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<Params>();
  const { sm } = useMedia();
  const { fetchBot } = useBotActions();
  const { fetchLeaderboard, fetchUserStats } = useLeaderboardActions();
  const router = useRouter();
  const pathname = usePathname();
  let botConfig = useSelector(state => selectBotsById(state, id));

  if (IS_USING_MOCK_DATA) {
    botConfig = data.bots.find(b => b.id === id);
  }

  const routes = [
    {
      path: `/bot/${id}`,
      name: 'Dashboard',
      key: 'dashboard',
      icon: <Grid size="$1" />,
    },
    {
      path: `/bot/${id}/settings`,
      name: 'Settings',
      key: 'settings',
      icon: <Cog size="$1" />,
    },
  ];

  useEffect(() => {
    fetchLeaderboard(id);
    fetchUserStats(id);
    fetchBot(id);
  }, [fetchBot, fetchLeaderboard, fetchUserStats, id]);

  const currentRoute = routes.find(r => r.path === pathname);

  const onTabPress = (tab: BotTab) => {
    router.push(tab.path);
  }

  const channelNameString = `\\${botConfig?.channelId}`;

  const title = (
    <Title>
      <Title.Button onPress={() => router.push('/')} />
      <Title.Avatar size={sm ? '$3' : '$5'} source={botConfig?.channelImageUrl} />
      <Title.Group>
        <Title.Heading size={sm ? '$2' : '$9'}>{botConfig?.channelName}</Title.Heading>
        <Title.Heading size="$1" color="$color11">{channelNameString}</Title.Heading>
      </Title.Group>
    </Title>
  );

  return (
    <XStack flexDirection="column">
      <Navbar title={sm ? title : undefined} />

      <Container>
        {!sm && title}

        <UnderlineTabs
          tabs={routes}
          onTabPress={onTabPress}
          marginBottom="$5"
          marginTop={!sm ? '$5' : null}
          defaultTab={currentRoute?.key}
        />

        {children}
      </Container>
    </XStack>
  );
}
