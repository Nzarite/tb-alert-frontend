import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface UserProfile {
  exp: number;
  iat: number;
  iss: string;
  aud: string | string[];
  sub: string;
  typ: string;
  sid: string | undefined;
  client_roles: object;
  email_verified: boolean | undefined;
  name: string | undefined;
  preferred_username: string | undefined;
  given_name: string | undefined;
  family_name: string | undefined;
  email: string | undefined;
}

interface UserState {
  profile: UserProfile | null;
}

const initialState: UserState = {
  profile: null,
};


export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      
    },
    clearUserProfile: (state) => {
      state.profile = null;
    },
  },
});

console.log(userSlice);


export const { setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
