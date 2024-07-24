import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchUser } from '@farcaster/rings-next/state/users/actions';
import { fetchUserRings } from '@farcaster/rings-next/state/common-actions';
import { User } from "@farcaster/rings-next/types";

export const usersAdapter = createEntityAdapter({
    selectId: (user: User) => user.fid,
});
const initialState = usersAdapter.getInitialState({
    isLoading: false,
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUser.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                usersAdapter.addOne(state, action.payload)
                state.isLoading = false;
            })
            .addCase(fetchUserRings.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchUserRings.fulfilled, (state, action) => {
                usersAdapter.addMany(state, action.payload.users)
                state.isLoading = false;
            });
    }
})

export default usersSlice.reducer;