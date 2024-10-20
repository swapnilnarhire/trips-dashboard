// pages/dashboard.js
import { useContext } from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { AuthContext } from "@/components/AuthProvider";
import withAuth from "@/hoc/withAuth";
import Shipment from "@/container/Shipment";

const Dashboard = () => {
  const { keycloak } = useContext(AuthContext);

  const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to Intugine Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        You are successfully authenticated!
      </Typography>
      <Button variant="contained" color="primary" onClick={logout}>
        Logout
      </Button>
      <Shipment />
    </Box>
  );
};

export default withAuth(Dashboard);
