import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: "",
  images: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,

  reducers: {
    logOut: () => initialState,
    mint: (state, { payload }) => {
      if (payload) {
        console.log('USER Address PAYLOAD: ', payload.address)
        state = {
          addresses: payload.address,
          imagees: [...payload.image || null]
        }
        return state
      }
    },
  },
});

export const { logOut, mint } = userSlice.actions;
export const userSelector = (state) => state.user
export default userSlice.reducer;