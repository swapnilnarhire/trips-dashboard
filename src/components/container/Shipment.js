import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
  Checkbox,
  Typography,
  Box,
  Paper,
  Grid,
  Pagination,
  PaginationItem,
} from "@mui/material";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { data } from "@/lib/data";

export default function Shipment() {
  const [sortBy, setSortBy] = useState("tripId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTrips, setSelectedTrips] = useState(new Set());
  const [trips, setTrips] = useState(data); // To store the trips data
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [pageSize, setPageSize] = useState(10); // Size of each page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const [loading, setLoading] = useState(false); // To show a loading state
  const [error, setError] = useState(null); // To handle errors

  const handleSortRequest = (property) => {
    const isAsc = sortBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const handleSelectTrip = (tripId) => {
    const newSelectedTrips = new Set(selectedTrips);
    if (newSelectedTrips.has(tripId)) {
      newSelectedTrips.delete(tripId);
    } else {
      newSelectedTrips.add(tripId);
    }
    setSelectedTrips(newSelectedTrips);
  };

  const sortedData =
    trips.length > 0
      ? trips.sort((a, b) => {
          if (sortDirection === "asc") {
            return a[sortBy] > b[sortBy] ? 1 : -1;
          }
          return a[sortBy] < b[sortBy] ? 1 : -1;
        })
      : [];

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <Paper elevation={1} sx={{ p: 1, m: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2 }}>
        <Typography>Trip List</Typography>

        {/* Add Trip and Update Trip Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: "none" }}
          >
            Add Trip
          </Button>
          {selectedTrips.size > 0 && (
            <Button variant="contained" size="small">
              Update Trip
            </Button>
          )}
        </Box>
      </Box>
      {/* Table for trips */}
      <TableContainer
        component={Grid}
        sx={{ maxHeight: "60vh", overflow: "auto" }}
      >
        <Table
          stickyHeader
          sx={{ minWidth: 650 }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {/* Empty cell for checkboxes */}
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "tripId"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("tripId")}
                >
                  Trip ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "transporter"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("transporter")}
                >
                  Transporter
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "source"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("source")}
                >
                  Source
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "dest"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("dest")}
                >
                  Destination
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "phoneNumber"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("phoneNumber")}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "etaDays"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("etaDays")}
                >
                  ETA
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "distanceRemaining"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("distanceRemaining")}
                >
                  Distance Remaining
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "currenStatus"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("currenStatus")}
                >
                  Trip Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "tatStatus"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("tatStatus")}
                >
                  TAT Status
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Scrollable Table Body */}
          <TableBody>
            {sortedData.map((trip) => (
              <TableRow key={trip._id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedTrips.has(trip._id)}
                    onChange={() => handleSelectTrip(trip._id)}
                  />
                </TableCell>
                <TableCell>{trip.tripId}</TableCell>
                <TableCell>{trip.transporter}</TableCell>
                <TableCell>{trip.source}</TableCell>
                <TableCell>{trip.dest}</TableCell>
                <TableCell>{trip.phoneNumber}</TableCell>
                <TableCell>{trip.etaDays}</TableCell>
                <TableCell>{trip.distanceRemaining}</TableCell>
                <TableCell>{trip.currenStatus}</TableCell>
                <TableCell>{trip?.tatStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          count={totalPages}
          showFirstButton
          showLastButton
          onChange={handleChangePage}
          color="primary"
          shape="rounded"
          size="small"
          renderItem={(item) => (
            <PaginationItem
              slots={{
                previous: KeyboardArrowLeftIcon,
                next: KeyboardArrowRightIcon,
                first: KeyboardDoubleArrowLeftIcon,
                last: KeyboardDoubleArrowRightIcon,
              }}
              {...item}
            />
          )}
        />
      )}
    </Paper>
  );
}
