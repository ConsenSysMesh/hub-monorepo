import { leaderboardsAdapter } from "@tipster/next/state/leaderboards/reducer";

export const { selectById: selectLeaderboardByConfigId } =
    leaderboardsAdapter.getSelectors(state => state.leaderboards);