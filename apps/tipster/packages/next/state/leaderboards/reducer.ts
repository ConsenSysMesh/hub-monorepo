import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchLeaderboard } from './actions';
import {Leaderboard} from "../../types";

export const leaderboardsAdapter = createEntityAdapter({
  selectId: (leaderboard: Leaderboard) => leaderboard.botConfigId,
});
const initialState = leaderboardsAdapter.getInitialState({
  isLoading: false,
});

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLeaderboard.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        leaderboardsAdapter.addOne(state, action.payload)
        state.isLoading = false;
      })
  }
})

export default leaderboardsSlice.reducer