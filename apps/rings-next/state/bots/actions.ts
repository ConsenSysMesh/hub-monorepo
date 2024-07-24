import { createAsyncThunk } from '@reduxjs/toolkit'
import getClient from '@farcaster/rings-next/api-client';
import {AxiosError} from "axios";

// https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#writing-thunks
// https://redux-toolkit.js.org/api/createAsyncThunk
const fetchBots = createAsyncThunk('bots/fetch', async () => {
  const response = await getClient().getBots();
  return response.data;
});

const fetchBot = createAsyncThunk('bot/fetch', async (botId) => {
  const response = await getClient().getBot(botId);
  return response.data;
});

const createBot = createAsyncThunk('bots/create', async (bot, { rejectWithValue }) => {
  try {
    const response = await getClient().createBot(bot)
    return response.data;
  } catch (e) {
    const err = e as AxiosError;
    return rejectWithValue({status: err.response?.status, message: err!.response?.data});
  }
});

const updateBot = createAsyncThunk('bots/update', async bot => {
  const response = await getClient().updateBot(bot)
  return response.data;
});

const deleteBot = createAsyncThunk('bots/delete', async botId => {
  const response = await getClient().deleteBot(botId)
  return response.data;
})

export { fetchBots, fetchBot, createBot, updateBot, deleteBot };