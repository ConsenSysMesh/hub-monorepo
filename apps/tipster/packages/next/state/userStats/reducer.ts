import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchUserStats } from './actions';
import {UserStats} from "../../types";

export const userStatsAdapter = createEntityAdapter({
    selectId: (userStats: UserStats) => userStats.botConfigId,
});
const initialState = userStatsAdapter.getInitialState({
    isLoading: false,
});

const userStatsSlice = createSlice({
    name: 'userStats',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUserStats.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchUserStats.fulfilled, (state, action) => {
                userStatsAdapter.addOne(state, action.payload)
                state.isLoading = false;
            })
    }
})

export default userStatsSlice.reducer