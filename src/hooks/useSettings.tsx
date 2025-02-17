import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../components/axiosInstance";
import { setSettings, updateSettings } from "../redux/settingsSlice";
import { RootState } from "../redux/store";

export const useSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.admin.settings);

  useEffect(() => {
    axiosInstance
      .get("/setting/all")
      .then((response) => dispatch(setSettings(response.data)))
      .catch((error) => console.log(error.message));
  }, [dispatch]);

  const updateSetting = (keyName: string, newValue: string, type: string) => {
    axiosInstance
      .put("/setting", { keyName, value: newValue, type })
      .then(() => dispatch(updateSettings({ keyName, newValue })))
      .catch((error) => console.log(error.message));
  };

  return { settings, updateSetting };
};
