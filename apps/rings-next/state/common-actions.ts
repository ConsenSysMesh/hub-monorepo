import { createAsyncThunk } from '@reduxjs/toolkit'
import getClient from '@farcaster/rings-next/api-client';

/**
 * Fetches this kind of related info: (user)<-[owner]-(ring)-[wearer]->(user)
 */
const fetchUserRings = createAsyncThunk('rings/fetch', async (fid: number) => {
    const results = await getClient().getOwnedAndWornRings(fid);
    return results;
});

export { fetchUserRings };