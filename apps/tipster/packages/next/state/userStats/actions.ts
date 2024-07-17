import { createAsyncThunk } from '@reduxjs/toolkit'
import getClient from '@tipster/next/api-client';

const fetchUserStats = createAsyncThunk('userStats/fetch', async (id) => {
    const response = await getClient().getUserStats(id);
    return response.data;
});

export { fetchUserStats };