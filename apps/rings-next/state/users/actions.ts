import { createAsyncThunk } from '@reduxjs/toolkit'
import getClient from '@farcaster/rings-next/api-client';
import { User } from '@farcaster/rings-next/types';

// TODO: user-specific actions here

const fetchUser = createAsyncThunk('users/fetch', async (fid: number) => {
    const response = await getClient().getUserDataByFid(fid);
    const userDataMsgs = response.messages;

    // TODO: construct a User object from the UserDataBody pieces in those msgs
   
    return {} as User;
});

export { fetchUser };