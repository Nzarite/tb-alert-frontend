import { useAuth } from "react-oidc-context";
import { Spin, Typography } from "antd";
import { ReactNode } from "react";

const { Title } = Typography;

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const auth = useAuth();

  const textAlignStyle: React.CSSProperties = { textAlign: "center" };
  const subTitleStyle: React.CSSProperties = { color: "grey" };

  if (auth.isLoading) {
    console.log("privaterute");
    return (
      <div style={textAlignStyle}>
        {/* <Title>Keycloak is loading</Title>
        <Title level={2} style={subTitleStyle}>
          or running authorization code flow with PKCE
        </Title> */}

        <Spin size="large" />
      </div>
    );
  }

  if (auth.error) {
    return (
      <div style={textAlignStyle}>
        <Title>Oops ...</Title>
        <Title level={2} style={subTitleStyle}>
          {auth.error?.message}
        </Title>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    auth.signinRedirect();
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
