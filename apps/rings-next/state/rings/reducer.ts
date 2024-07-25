import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchUserRings } from '@farcaster/rings-next/state/common-actions';
import { getMessageStoreId } from "@farcaster/rings-next/state/utils";
import { Message } from '@farcaster/hub-web';

export const ringsAdapter = createEntityAdapter({
    selectId: (ring: Message) => getMessageStoreId(ring),
});
const initialState = ringsAdapter.getInitialState({
    isLoading: false,
});

const ringsSlice = createSlice({
    name: 'rings',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUserRings.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchUserRings.fulfilled, (state, action) => {
                ringsAdapter.addMany(state, action.payload.rings)
                state.isLoading = false;
            });
    },
    // selectors: {
    //     selectIsLoading: state => state.isLoading
    // }
});

export const selectors = ringsSlice.selectors;

export default ringsSlice.reducer;