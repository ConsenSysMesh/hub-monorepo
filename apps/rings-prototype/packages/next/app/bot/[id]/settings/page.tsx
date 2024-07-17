'use client';
import { Spinner } from 'tamagui';
import BotForm from "@tipster/next/components/bot/BotForm";
import { useSelector } from "react-redux";
import { selectBotsById } from "@tipster/next//state/bots/selectors";
import { useParams } from "next/navigation";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import React from "react";
import data from "@tipster/next/data";
import {IS_USING_MOCK_DATA} from "@tipster/next/constants";

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
