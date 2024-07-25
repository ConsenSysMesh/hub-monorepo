import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchUserRings } from '@farcaster/rings-next/state/common-actions';
import { updateStone } from '@farcaster/rings-next/state/stones/actions';
import { getMessageStoreId } from "@farcaster/rings-next/state/utils";
import { Message } from '@farcaster/hub-web';

export const stonesAdapter = createEntityAdapter({
    selectId: (stone: Message) => getMessageStoreId(stone),
});
const initialState = stonesAdapter.getInitialState({
    isLoading: false,
});

const stonesSlice = createSlice({
    name: 'stones',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUserRings.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchUserRings.fulfilled, (state, action) => {
                stonesAdapter.addMany(state, action.payload.stones)
                state.isLoading = false;
            })
            .addCase(updateStone.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(updateStone.fulfilled, (state, action) => {
                stonesAdapter.addOne(state, action.payload)
                state.isLoading = false;
            });
    }
});

export default stonesSlice.reducer;