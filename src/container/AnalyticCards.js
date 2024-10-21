import { Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";

export default function AnalyticCards() {
  return (
    <Box mx={0.5}>
      <Grid container spacing={2}>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2 }}>
            <Typography variant="h6">Total trips</Typography>
            <Typography variant="h5">18,033</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2 }}>
            <Typography variant="h6">Delivered</Typography>
            <Typography variant="h5">18,033</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2 }}>
            <Typography variant="h6">Total trips</Typography>
            <Typography variant="h5">18,033</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2 }}>
            <Typography variant="h6">Delayed</Typography>
            <Typography variant="h5">18,033</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2 }}>
            <Typography variant="h6">In transit</Typography>
            <Typography variant="h5">18,033</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <Paper varient="outlined" sx={{ p: 2 }}>
            <Typography variant="h6">Delivered</Typography>
            <Typography variant="h5">18,033</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
