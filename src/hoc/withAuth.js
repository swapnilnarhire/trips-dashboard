// components/withAuth.js
import { AuthContext } from "@/components/AuthProvider";
import Loader from "@/components/Loader";
import { useContext } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const auth = useContext(AuthContext);

    if (!auth.authenticated) {
      // Optionally handle unauthorized access
      return <Loader />; // You can replace this with a loading spinner or redirect
    }

    return <WrappedComponent {...props} auth={auth} />;
  };
};

export default withAuth;
