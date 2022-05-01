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
          address: payload.address,
          images: [...payload.image]
        }
        return state
      }
    },
  },
});

export const { logOut, mint } = userSlice.actions;
export const userSelector = (state) => state.user
export default userSlice.reducer;