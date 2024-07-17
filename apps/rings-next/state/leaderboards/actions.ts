import { createAsyncThunk } from '@reduxjs/toolkit'
import getClient from '@farcaster/rings-next/api-client';

const fetchLeaderboard = createAsyncThunk('leaderboard/fetch', async (id) => {
  const response = await getClient().getLeaderboard(id);
  return response.data;
});

export { fetchLeaderboard };