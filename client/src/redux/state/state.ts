import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ITimezone} from "react-timezone-select";

export interface UserEmail {
  email: string;
  timeZone: ITimezone;
}

const initialState: UserEmail = {
  email: "", // Initial email
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Initial timezone
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<UserEmail>) => {
      state.email = action.payload.email;
      state.timeZone = action.payload.timeZone;
    },
  },
});

export const {setEmail} = globalSlice.actions;
export default globalSlice.reducer;
