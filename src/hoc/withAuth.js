import { AuthContext } from "@/components/AuthProvider";
import Loader from "@/components/Loader";
import { useContext } from "react";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const auth = useContext(AuthContext);

    if (!auth.authenticated) {
      // Optionally handle unauthorized access
      return <Loader />; // You can replace this with a loading spinner or redirect
    }

    return <WrappedComponent {...props} auth={auth} />;
  };

  // Add a display name for debugging purposes
  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthenticatedComponent;
};

export default withAuth;
