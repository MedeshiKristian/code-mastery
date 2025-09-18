import { createSlice } from '@reduxjs/toolkit';

const initialState = { user: JSON.parse(localStorage.getItem('user')) };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserId(state, action) {
      state.user = action.payload;
      if (!action.payload) {
        localStorage.removeItem('user');
      } else {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
  },
});

export const { setUserId } = authSlice.actions;

export default authSlice.reducer;
