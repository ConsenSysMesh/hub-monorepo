import {selectors, botsAdapter } from "@farcaster/rings-next/state/bots/reducer";

// https://redux-toolkit.js.org/api/createSlice#getselectors
export const { selectAll: selectBots, selectById: selectBotsById } =
  botsAdapter.getSelectors(state => state.bots);

export const { selectIsLoading: selectBotsIsLoading } = selectors;