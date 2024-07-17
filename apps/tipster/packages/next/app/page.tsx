'use client';
import React, { useEffect } from "react";
import { Spinner, XStack, YStack } from 'tamagui';
import Title from "@tipster/next/components/title/Title";
import BotList from "@tipster/next/components/bot/BotList";
import Navbar from "@tipster/next/components/navbar/Navbar";
import { useBotActions } from '@tipster/next/hooks/useBotActions';
import { selectBots, selectBotsIsLoading } from '@tipster/next/state/bots/selectors';
import { useSelector } from 'react-redux';
import BotDialog from "@tipster/next/components/bot/BotDialog";
import Container from "@tipster/next/components/container/Container";
import data from "@tipster/next/data";
import {IS_USING_MOCK_DATA} from "@tipster/next/constants";

export default function HomePage() {
  const { fetchBots } = useBotActions();
  const bots = useSelector(selectBots);
  const isLoading = useSelector(selectBotsIsLoading);

  useEffect(() => {
    // TODO: for some reason this fetch is being executed twice on initial page load. Check to see why.
    fetchBots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <XStack flexDirection="column">
      <Navbar />

      <Container>
        <Title marginBottom="$4">
          <Title.Group>
            <Title.Heading size="$9" marginBottom="$5">Home</Title.Heading>
            <Title.Heading size="$7">Your Community TipBots</Title.Heading>
          </Title.Group>
        </Title>

        { isLoading && !IS_USING_MOCK_DATA ?
          <YStack flex={1} marginBottom="$4" justifyContent="center" alignItems="center">
            <Spinner size="large" color="$violet8" />
          </YStack> :
          IS_USING_MOCK_DATA ?
            <BotList bots={data.bots} marginBottom="$4" /> :
            <BotList bots={bots} marginBottom="$4" />
        }
        <BotDialog />
      </Container>
    </XStack>
  )
}
