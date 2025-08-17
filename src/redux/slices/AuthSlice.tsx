import { createSlice } from "@reduxjs/toolkit";

export type AuthSliceTypes = {
  first_name: String;
  last_name: String;
  email: String;
  password: String;
  profile: String;
  token: String;
  isLogged: Boolean;
  rememberUser: Boolean;
};

const initialState: AuthSliceTypes = {
  first_name: "Elon",
  last_name: "Musk",
  email: "eve.holt@reqres.in",
  password: "cityslicka",
  profile: "https://reqres.in/img/faces/2-image.jpg",
  token: "",
  isLogged: false,
  rememberUser: false,
};

const authSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    logUser: (state, action) => {
      return state = { ...state, ...action.payload };
    },
    logout: (state: any) => {
      if (state.rememberUser) {
        state.isLogged = false;
        return state;
      } else {
        state.token = "";
        state.isLogged = false;
        return state;
      }
    },
  },
});

export const { logUser, logout } = authSlice.actions;
export default authSlice;
