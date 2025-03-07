import axiosInstance from "../../components/axiosInstance";

const fetchSettings = async () => {
  try {
    const response = await axiosInstance.get("/setting/all");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return [];
  }
};

const postSetting = async (value, endpoint: string) => {
  try {
    await axiosInstance.post(endpoint, value);
  } catch (error) {
    console.error("Error posting setting:", error);
  }
};

const fetchMedications = async () => {
  try {
    const response = await axiosInstance.get("/medication/all");
    return response.data.map((med) => med.name);
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
};

const fetchStates = async () => {
  try {
    const response = await axiosInstance.get("/state/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
};

const updateSetting = async (keyName: string, value) => {
  try {
    await axiosInstance.put("/setting", { keyName, value });
  } catch (error) {
    console.error("Error updating setting:", error);
  }
};

export {
  fetchMedications,
  fetchSettings,
  fetchStates,
  postSetting,
  updateSetting,
};
