import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchUserRings } from '@farcaster/rings-next/state/common-actions';
import { updateWearer } from '@farcaster/rings-next/state/relationships/actions';
import { getMessageStoreId } from "@farcaster/rings-next/state/utils";
import { Message } from '@farcaster/hub-web';

export const relationshipsAdapter = createEntityAdapter({
    selectId: (rel: Message) => getMessageStoreId(rel),
});
const initialState = relationshipsAdapter.getInitialState({
    isLoading: false,
});

const relationshipsSlice = createSlice({
    name: 'relationships',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUserRings.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchUserRings.fulfilled, (state, action) => {
                relationshipsAdapter.addMany(state, action.payload.relationships)
                state.isLoading = false;
            })
            .addCase(updateWearer.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(updateWearer.fulfilled, (state, action) => {
                if (action.payload.removed) {
                    relationshipsAdapter.removeOne(state, getMessageStoreId(action.payload.removed));
                }
                relationshipsAdapter.addOne(state, action.payload.added);
                state.isLoading = false;
            });
    }
});

export default relationshipsSlice.reducer;