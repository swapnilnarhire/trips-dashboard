import withAuth from "@/hoc/withAuth";
import Shipment from "@/container/Shipment";
import AnalyticCards from "@/container/AnalyticCards";
import Header from "@/container/Header";
import { Box } from "@mui/material";

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
