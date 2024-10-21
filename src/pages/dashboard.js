// pages/dashboard.js
import { useContext } from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { AuthContext } from "@/components/AuthProvider";
import withAuth from "@/hoc/withAuth";
import Shipment from "@/container/Shipment";
import AnalyticCards from "@/container/AnalyticCards";
import Header from "@/container/Header";

const Dashboard = () => {
  return (
    <Box>
      <Header />
      <AnalyticCards />
      <Shipment />
    </Box>
  );
};

export default withAuth(Dashboard);
