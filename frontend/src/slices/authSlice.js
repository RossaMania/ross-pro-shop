import { createSlice }from "@reduxjs/toolkit";

// Initial state of the auth slice.
const initialState = {
  userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
}

// Create the auth slice with the setCredentials reducer function to set the user's credentials in the state.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // Set the user's credentials in the state with the data from the payload and save it to local storage.
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
  }
})

//Export the setCredentials reducer function from the auth slice as an action.
export const { setCredentials } = authSlice.actions;

// Export the auth slice as the default reducer function.
export default authSlice.reducer;