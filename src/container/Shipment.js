import React, { Suspense, useEffect, useState } from "react";
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
  CircularProgress,
  styled,
  tableCellClasses,
} from "@mui/material";

// icons
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { fetchTrips } from "@/utils/axiosApiServices";
import Loader from "@/components/Loader";
import SelectDropdown from "@/components/SelectDropdown";
// Lazily import AddTripDialog
const AddTrip = React.lazy(() => import("./AddTrip"));
const UpdateStatus = React.lazy(() => import("./UpdateStatus"));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#E0E0E0",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function Shipment() {
  const [sortBy, setSortBy] = useState("tripId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedTrips, setSelectedTrips] = useState(new Set());
  const [trips, setTrips] = useState([]); // To store the trips data
  const [totalTrips, setTotalTrips] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [pageSize, setPageSize] = useState(20); // Size of each page
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const [loading, setLoading] = useState(false); // To show a loading state
  const [error, setError] = useState(null); // To handle errors
  const [openAddTrip, setOpenAddTrip] = useState(false);
  const [openUpStatus, setOpenUpStatus] = useState(false);

  // Fetch data from API whenever currentPage or pageSize changes
  const fetchTripsData = async (payload) => {
    setLoading(true); // Set loading to true before the API call
    setError(null); // Reset any previous error state

    fetchTrips(payload)
      .then((data) => {
        setTrips(data.trips);
        setTotalPages(data.totalPages);
        setPageSize(data.pageSize);
        setTotalTrips(data.totalTrips);
      })
      .catch((err) => {
        setError("Failed to fetch trips data");
        console.error(err);
      })
      .finally(() => {
        setLoading(false); // Always set loading to false after the API call
      });
  };

  useEffect(() => {
    const payload = {
      pageNo: currentPage,
      size: pageSize,
    };
    fetchTripsData(payload); // Call the API
  }, [currentPage, pageSize]);

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
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <Paper elevation={1} sx={{ p: 1, m: 1 }}>
      {loading && <Loader />}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Trip List</Typography>
        </Grid>

        {/* Add Trip and Update Trip Buttons */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }} mb={2}>
            {selectedTrips.size > 0 && (
              <Button
                variant="outlined"
                size="small"
                sx={{ textTransform: "none", mr: 1 }}
                onClick={() => setOpenUpStatus(true)}
                disabled={openUpStatus}
              >
                Update status
              </Button>
            )}{" "}
            <Button
              variant="contained"
              size="small"
              sx={{ textTransform: "none", ml: 1 }}
              onClick={() => setOpenAddTrip(true)}
              disabled={openAddTrip}
            >
              Add Trip
            </Button>
          </Box>
        </Grid>
      </Grid>
      {/* Table for trips */}
      <TableContainer
        component={Grid}
        sx={{ maxHeight: "55vh", overflow: "auto" }}
      >
        <Table
          stickyHeader
          sx={{ minWidth: 650 }}
          size="small"
          aria-label="a dense table"
        >
          <TableHead component="head" style={{ background: "#E0E0E0" }}>
            <TableRow>
              <StyledTableCell padding="checkbox">
                {/* Empty cell for checkboxes */}
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortBy === "tripId"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("tripId")}
                >
                  Trip ID
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortBy === "transporter"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("transporter")}
                >
                  Transporter
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortBy === "source"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("source")}
                >
                  Source
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortBy === "dest"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("dest")}
                >
                  Destination
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortBy === "phoneNumber"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("phoneNumber")}
                >
                  Phone
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortBy === "etaDays"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("etaDays")}
                >
                  ETA
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortBy === "distanceRemaining"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("distanceRemaining")}
                >
                  Distance Remaining
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortBy === "currenStatus"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("currenStatus")}
                >
                  Trip Status
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortBy === "tatStatus"}
                  direction={sortDirection}
                  onClick={() => handleSortRequest("tatStatus")}
                >
                  TAT Status
                </TableSortLabel>
              </StyledTableCell>
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
                <TableCell component={Typography} noWrap sx={{ maxWidth: 100 }}>
                  {trip.tripId}
                </TableCell>
                <TableCell>{trip.transporter}</TableCell>
                <TableCell>{trip.source}</TableCell>
                <TableCell>{trip.dest}</TableCell>
                <TableCell>{trip.phoneNumber}</TableCell>
                <TableCell>{trip.etaDays}</TableCell>
                <TableCell>{trip.distanceRemaining}</TableCell>
                <TableCell>{trip.currentStatus}</TableCell>
                <TableCell>{trip?.tatStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display={"flex"} justifyContent={"space-between"} mt={0.5}>
        <Box display={"flex"} justifyContent={"space-around"}>
          {totalTrips && (
            <Typography variant="body2" mr={2}>
              Viewing 1-{pageSize} of &nbsp;
              {totalTrips} &nbsp; records
            </Typography>
          )}
          <Typography variant="body2" mr={2}>
            Rows per page:
          </Typography>
          <SelectDropdown
            id={"pageSize"}
            name="pageSize"
            value={pageSize}
            handlechange={handleChangeRowsPerPage}
            variant="outlined"
            size="small"
            disabled={loading}
            options={[
              {
                label: "20",
                value: 20,
              },
              {
                label: "50",
                value: 50,
              },
              {
                label: "100",
                value: 100,
              },
              {
                label: "500",
                value: 500,
              },
            ]}
          />
        </Box>
        {totalPages > 0 && (
          <Pagination
            page={currentPage}
            count={totalPages}
            siblingCount={1}
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
      </Box>
      <Suspense fallback={<CircularProgress />}>
        {openAddTrip && (
          <AddTrip open={openAddTrip} onClose={() => setOpenAddTrip(false)} />
        )}
      </Suspense>
      <Suspense fallback={<CircularProgress />}>
        {openUpStatus && (
          <UpdateStatus
            open={openUpStatus}
            onClose={() => setOpenUpStatus(false)}
          />
        )}
      </Suspense>
    </Paper>
  );
}
