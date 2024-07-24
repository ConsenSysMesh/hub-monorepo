import { createAsyncThunk } from '@reduxjs/toolkit'
import getClient from '@farcaster/rings-next/api-client';

// TODO: relationship-specific actions here

// const fetchUser = createAsyncThunk('users/fetch', async (id: number) => {
//     const response = await getClient().getUserDataByFid(id);
//     return response.data;
// });

// export { fetchUser };