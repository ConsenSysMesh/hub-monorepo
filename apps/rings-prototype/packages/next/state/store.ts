import { configureStore } from '@reduxjs/toolkit'

import botsReducer from '@tipster/next/state/bots/reducer'
import leaderboardsReducer from '@tipster/next/state/leaderboards/reducer';
import userStatsReducer from '@tipster/next/state/userStats/reducer';

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