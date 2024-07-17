import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import { fetchBots, fetchBot, createBot, updateBot, deleteBot } from '@tipster/next/state/bots/actions';

export const useBotActions = () => {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      fetchBots: () => dispatch(fetchBots()),
      fetchBot: (botId) => dispatch(fetchBot(botId)),
      createBot: (bot) => dispatch(createBot(bot)),
      updateBot: (bot) => dispatch(updateBot(bot)),
      deleteBot: (botId) => dispatch(deleteBot(botId)),
    }),
    [dispatch]
  );
};
