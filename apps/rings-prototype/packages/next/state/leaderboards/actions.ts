import { createAsyncThunk } from '@reduxjs/toolkit'
import getClient from '@tipster/next/api-client';

const fetchLeaderboard = createAsyncThunk('leaderboard/fetch', async (id) => {
  const response = await getClient().getLeaderboard(id);
  return response.data;
});

export { fetchLeaderboard };