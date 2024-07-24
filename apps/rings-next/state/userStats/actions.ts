import { createAsyncThunk } from '@reduxjs/toolkit'
import getClient from '@farcaster/rings-next/api-client';

const fetchUserStats = createAsyncThunk('userStats/fetch', async (id) => {
    const response = await getClient().getUserStats(id);
    return response.data;
});

export { fetchUserStats };