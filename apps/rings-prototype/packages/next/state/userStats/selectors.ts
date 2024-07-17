import { userStatsAdapter } from "@tipster/next/state/userStats/reducer";

export const { selectById: selectUserStatsByConfigId } =
    userStatsAdapter.getSelectors(state => state.userStats);