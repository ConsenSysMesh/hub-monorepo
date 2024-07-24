import { configureStore } from '@reduxjs/toolkit'

import botsReducer from '@farcaster/rings-next/state/bots/reducer'
import leaderboardsReducer from '@farcaster/rings-next/state/leaderboards/reducer';
import userStatsReducer from '@farcaster/rings-next/state/userStats/reducer';

// https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#using-configurestore
// https://redux-toolkit.js.org/api/configureStore
const store = configureStore({
  reducer: {
    bots: botsReducer,
    leaderboards: leaderboardsReducer,
    userStats: userStatsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export default store