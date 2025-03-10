import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import axiosInstance from "./components/axiosInstance";
import { UserProfile, setUserProfile, setUserState } from "./redux/userSlice";
import { RootState } from "./redux/store";

const App = () => {
  const auth = useAuth();
  const profile = auth?.user?.profile;
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.userState);

  console.log("app.tsx");

  useEffect(() => {
    if (profile) {
      const userProfile = profile as unknown as UserProfile;
      dispatch(setUserProfile(userProfile));

      const fetchUserDetails = async () => {
        try {
          const response = await axiosInstance.get(
            `/person/email/${profile.email}`
          );

          if (response.data.state) {
            dispatch(setUserState(response.data.state));
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [profile, dispatch]);

  return <>{userState && <Outlet />}</>;
};

export default App;
