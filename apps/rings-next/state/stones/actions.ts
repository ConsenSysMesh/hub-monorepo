import { createAsyncThunk } from '@reduxjs/toolkit'
import getClient from '@farcaster/rings-next/api-client';
import { TagBody } from '@farcaster/hub-web';

const updateStone = createAsyncThunk('stones/update', async (params: { fid: number, changes: TagBody }) => {
    const response = await getClient().updateStone(params.fid, params.changes);
    return response;
});

export { updateStone };