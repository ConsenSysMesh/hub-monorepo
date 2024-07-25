import { createAsyncThunk } from '@reduxjs/toolkit'
import getClient from '@farcaster/rings-next/api-client';
import { Message, RelationshipAddBody } from '@farcaster/hub-web';

const updateWearer = createAsyncThunk('ring/updateWearer', async (params: { fid: number, newWearer: RelationshipAddBody, existingWearer: Message | undefined }) => {
    const response = await getClient().updateRingWearer(params.fid, params.newWearer, params.existingWearer);
    return response;
});

export { updateWearer };