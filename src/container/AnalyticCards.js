import CircularWithValueLabel from "@/components/CircularProgressWithLabel";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React from "react";

export default function AnalyticCards() {
  return (
    <Box mx={0.5}>
      <Grid container spacing={0.5}>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6">Total trips</Typography>
            <Typography variant="h5">18,033</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6">Delivered</Typography>
            <Typography variant="h5">18,033</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2, height: "100%" }}>
            <Box display={"flex"} justifyContent={"center"}>
              <CircularWithValueLabel value={85} />
            </Box>{" "}
            <Typography variant="body2" align="center">
              Ontime:
              <Button
                size="small"
                sx={{ textTransform: "none" }}
                disableElevation
                variant="text"
              >
                1,23,456
              </Button>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2, background: "#FFEEEE" }}>
            <Typography variant="h6" color={"#CC3333"}>
              Delayed
            </Typography>
            <Typography variant="h5">18,033</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6">In transit</Typography>
            <Typography variant="h5">
              18,033{" "}
              <Button
                size="small"
                sx={{ background: "#D7E3FE", textTransform: "none" }}
                disableElevation
              >
                72%
              </Button>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6">Delivered</Typography>
            <Typography variant="h5">
              18,033
              <Button
                size="small"
                sx={{ background: "#D7E3FE", textTransform: "none" }}
                disableElevation
              >
                72%
              </Button>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
