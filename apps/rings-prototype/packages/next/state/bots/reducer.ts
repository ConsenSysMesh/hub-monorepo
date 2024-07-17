import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { fetchBots, fetchBot, createBot, updateBot, deleteBot } from './actions';
import { Bot } from "../../types";

// https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#using-createentityadapter
// https://redux-toolkit.js.org/api/createEntityAdapter
export const botsAdapter = createEntityAdapter({
  selectId: (bot: Bot) => bot.id,
});
const initialState = botsAdapter.getInitialState({
  isLoading: false,
});

// https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#writing-slices
// https://redux-toolkit.js.org/api/createSlice
const botsSlice = createSlice({
  name: 'bots',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBots.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchBots.fulfilled, (state, action) => {
        botsAdapter.setAll(state, action.payload)
        state.isLoading = false;
      })
      .addCase(fetchBot.fulfilled, (state, action) => {
        botsAdapter.setOne(state, action.payload)
        state.isLoading = false;
      })
      .addCase(createBot.fulfilled, botsAdapter.addOne)
      .addCase(updateBot.fulfilled, botsAdapter.updateOne)
      .addCase(deleteBot.fulfilled, botsAdapter.removeOne)
  },
  selectors: {
    selectIsLoading: state => state.isLoading
  }
})

export const selectors = botsSlice.selectors;

export default botsSlice.reducer