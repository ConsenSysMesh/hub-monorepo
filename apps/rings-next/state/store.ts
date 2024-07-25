import { configureStore } from '@reduxjs/toolkit'

import userReducer from '@farcaster/rings-next/state/users/reducer';
import ringsReducer from '@farcaster/rings-next/state/rings/reducer';
import stonesReducer from '@farcaster/rings-next/state/stones/reducer';
import relationshipsReducer from '@farcaster/rings-next/state/relationships/reducer';

// https://redux.js.org/tutorials/fundamentals/part-8-modern-redux#using-configurestore
// https://redux-toolkit.js.org/api/configureStore
const store = configureStore({
  reducer: {
    users: userReducer,
    rings: ringsReducer,
    stones: stonesReducer,
    relationships: relationshipsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export default store