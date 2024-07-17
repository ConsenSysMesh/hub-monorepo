'use client';
import React, { useEffect } from "react";
import { Spinner, XStack, YStack } from 'tamagui';
import Title from "@farcaster/rings-next/components/title/Title";
import BotList from "@farcaster/rings-next/components/bot/BotList";
import Navbar from "@farcaster/rings-next/components/navbar/Navbar";
import { useBotActions } from '@farcaster/rings-next/hooks/useBotActions';
import { selectBots, selectBotsIsLoading } from '@farcaster/rings-next/state/bots/selectors';
import { useSelector } from 'react-redux';
import BotDialog from "@farcaster/rings-next/components/bot/BotDialog";
import Container from "@farcaster/rings-next/components/container/Container";
import data from "@farcaster/rings-next/data";
import {IS_USING_MOCK_DATA} from "@farcaster/rings-next/constants";
import apiClient from "@farcaster/rings-next/api-client";
import {
  ObjectRefTypes,
} from "@farcaster/hub-web";

const HUB_URL = "127.0.0.1:2283"; // URL + Port of the Hub
const FID = 773349;
const ObjType = "REALFIN";

export default function HomePage() {
  const { fetchBots } = useBotActions();
  const bots = useSelector(selectBots);
  const isLoading = useSelector(selectBotsIsLoading);

  useEffect(() => {
    // TODO: invoke store actions instead
    const client = apiClient();
    client.getOwnedRings(FID)
      .then(r => console.log(r));

    // TODO: for some reason this fetch is being executed twice on initial page load. Check to see why.
    // fetchBots();
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
