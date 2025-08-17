import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataType } from "../../pages/Users";
import { store } from "../Store";
import ServerApis from "../../server/ServerApi";
export type AppDispatch = typeof store.dispatch;

type userDataType =
  | {
      data: DataType[];
      page: number;
      per_page: number;
      total: number;
      total_pages?: number;
      [key: string]: any;
    }
  | undefined;

const initialState: userDataType = {
  status: "pending",
  data: [],
  page: 0,
  per_page: 0,
  total: 0,
  search_count: null,
  total_pages: 0,
  visitedPage: [],
  currentUsers: [],
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (params: any, thunkAPI) => {
  try {
    const { getUsers } = ServerApis();
    const { visitedPage, page, total, per_page } = params;
    if (!visitedPage.includes(page)) {
      const response: { [key: string]: any } = await getUsers({
        headers: { "x-api-key": "reqres-free-v1" },
        params: { page },
      });

      if (response.status === 200) {
        return { ...response.data, listedPage: page };
      }
    } else {
      return { page, per_page, total };
    }
  } catch (error: any) {
    console.log("error on fetching users", error);
    return thunkAPI.rejectWithValue(error);
  }
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
      addUser: (state, action) => {
      const total = state.total + 1;
      state.data = [{ id: total, ...action.payload }, ...state.data];
      state.total = total;
      state.total_pages = Math.ceil(total / 6);
    },
    updateUser: (state, action) => {
      const copy = [...state.data];
      const index = copy.findIndex(({ id }) => action.payload.id === id);
      copy.splice(index, 1, action.payload);
      state.data = copy;
    },
    deleteUser: (state, action) => {
        state.data = state.data.filter(({ id }) => action.payload.id !== id);
        state.total = state.total - 1;
    },
    searchUser: (state, action) => {
      const filteredUsers = state.data.filter((user) => {
        const query = action.payload.query.toLowerCase();
        return (
          user.email.toLowerCase().includes(query) ||
          user.first_name.toLowerCase().includes(query) ||
          user.last_name.toLowerCase().includes(query)
        );
      });
      state.currentUsers = filteredUsers.slice(
        action.payload.page * state.per_page - state.per_page,
        action.payload.page * state.per_page
      );
      state.page = action.payload.page;
      state.search_count = filteredUsers.length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        if (["fulfilled", "rejected"].includes(state.status)) return;
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "fulfilled";
        if (!action.payload) return;
        const { data, page, per_page, total, total_pages, listedPage } = action.payload;
        if (!state.visitedPage.includes(listedPage) && data?.length) {
          state.data = [...state.data, ...data];
          state.page = page;
          state.per_page = per_page;
          state.total = total;
          state.total_pages = total_pages;
          state.visitedPage = [...state.visitedPage, listedPage].filter(Boolean);
        }
        state.search_count = null;
        state.visitedPage = [...state.visitedPage, listedPage].filter(Boolean);
        state.currentUsers = state.data.slice(page * per_page - per_page, page * per_page);
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { addUser, updateUser, deleteUser, searchUser } = userSlice.actions;
export default userSlice;
