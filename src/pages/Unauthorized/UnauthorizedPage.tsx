import { Navigate } from "react-router-dom";

const UnauthorizedPage = () => {
  return <Navigate to={"/"} />;
};

export default UnauthorizedPage;
