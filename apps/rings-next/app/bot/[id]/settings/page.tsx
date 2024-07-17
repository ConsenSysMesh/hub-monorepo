'use client';
import { Spinner } from 'tamagui';
import BotForm from "@farcaster/rings-next/components/bot/BotForm";
import { useSelector } from "react-redux";
import { selectBotsById } from "@farcaster/rings-next//state/bots/selectors";
import { useParams } from "next/navigation";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";
import data from "@farcaster/rings-next/data";
import {IS_USING_MOCK_DATA} from "@farcaster/rings-next/constants";

export default function BotSettingsPage() {
  const { id } = useParams<Params>();
  let botConfig = useSelector(state => selectBotsById(state, id));

  if (IS_USING_MOCK_DATA) {
    botConfig = data.bots.find(b => b.id === id);
  }

  // BotForm doesn't seem to react to defaultValues changing, so avoid rendering it
  // until we have the data to show
  return (botConfig ?
    <BotForm
      defaultValues={botConfig}
      isNewBot={false}
    /> :
    <Spinner color="$color8" />
  );
}
