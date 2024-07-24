import { userStatsAdapter } from "@farcaster/rings-next/state/userStats/reducer";

export const { selectById: selectUserStatsByConfigId } =
    userStatsAdapter.getSelectors(state => state.userStats);