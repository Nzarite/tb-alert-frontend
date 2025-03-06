import { useEffect } from "react";
import { useSelector } from "react-redux"; // Assuming Redux is used
import useLogout from "./useLogout";

const useCustomEffect = () => {
  const logout = useLogout();
  const userState = useSelector((state: any) => state.userState);

  useEffect(() => {
    if (userState !== null) return; // Wait until Redux state is available

    const handleStorageChange = () => {
      if (!localStorage.getItem("userState")) {
        logout();
      }
    };

    // Check initially and listen for changes
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Run only when userState updates
};

export default useCustomEffect;
