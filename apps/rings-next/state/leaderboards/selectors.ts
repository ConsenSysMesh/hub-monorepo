import { leaderboardsAdapter } from "@farcaster/rings-next/state/leaderboards/reducer";

export const { selectById: selectLeaderboardByConfigId } =
    leaderboardsAdapter.getSelectors(state => state.leaderboards);