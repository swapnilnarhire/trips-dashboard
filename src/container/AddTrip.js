import React, { useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Autocomplete,
} from "@mui/material";
import {
  getTransporter,
  getLocationSuggestions,
} from "@/utils/axiosApiServices"; // Assuming you have an API service for location
import SelectDropdown from "@/components/SelectDropdown";

// Regular expression for Trip ID (only numbers)
const tripIdRegex = /^[0-9]+$/;

const validationSchema = Yup.object({
  tripId: Yup.string()
    .matches(tripIdRegex, "Trip ID must be a number")
    .required("Trip ID is required"),
  source: Yup.string().required("Source value is required"),
  destination: Yup.string().required("Destination value is required"),
  transporter: Yup.string().required("Transporter is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
});

const AddTrip = () => {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(false); // To show a loading state
  const [error, setError] = useState(null); // To handle errors
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  const formik = useFormik({
    initialValues: {
      tripId: "",
      source: "",
      destination: "",
      transporter: "",
      phone: "",
    },
    validateOnBlur: true,
    validateOnChange: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const getTransporterData = () => {
    setLoading(true); // Set loading to true before the API call
    setError(null); // Reset any previous error state
    getTransporter()
      .then((res) => {
        setCouriers(res);
      })
      .catch((err) => {
        console.log("Error: " + err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTransporterData();
  }, []);

  // Debounce utility to limit API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const fetchOptions = useCallback(
    debounce((inputValue, field) => {
      if (!inputValue || inputValue.trim() === "") {
        // Clear options if input is empty or just whitespace
        if (field === "source") {
          setSourceOptions([]);
        } else {
          setDestinationOptions([]);
        }
        return;
      }

      // Fetch options for source or destination based on field
      getLocationSuggestions(inputValue.trim())
        .then((res) => {
          if (field === "source") {
            setSourceOptions(res); // Update source options
          } else if (field === "destination") {
            setDestinationOptions(res); // Update destination options
          }
        })
        .catch((err) => {
          console.error("Error fetching options for " + field + ": ", err);
          // Clear options in case of error
          if (field === "source") {
            setSourceOptions([]);
          } else {
            setDestinationOptions([]);
          }
        });
    }, 300),
    []
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add Trip Details
      </Typography>

      <Grid container spacing={2}>
        {/* Trip ID Field */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Trip ID</Typography>
          <TextField
            fullWidth
            id="tripId"
            name="tripId"
            placeholder="Enter Trip ID"
            value={formik.values.tripId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.tripId && Boolean(formik.errors.tripId)}
            helperText={formik.touched.tripId && formik.errors.tripId}
            size="small"
          />
        </Grid>

        {/* Transporter Dropdown */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Transporter</Typography>
          <SelectDropdown
            id={"transporter"}
            name="transporter"
            value={formik.values.transporter}
            handlechange={(e) => {
              formik.setFieldValue(`transporter`, e.target.value);
              const findPhone = couriers.find(
                (c) => c.value === e.target.value
              );
              if (findPhone) {
                formik.setFieldValue(`phone`, findPhone?.phone_number);
              }
            }}
            variant="outlined"
            size="small"
            disabled={loading}
            options={couriers}
            error={
              formik.touched.transporter && Boolean(formik.errors.transporter)
            }
            helperText={formik.touched.transporter && formik.errors.transporter}
          />
        </Grid>

        {/* Source Autocomplete */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Source</Typography>
          <Autocomplete
            fullWidth
            options={sourceOptions}
            getOptionLabel={(option) => option.label || ""}
            onInputChange={(event, newInputValue) => {
              fetchOptions(newInputValue, "source");
              formik.setFieldValue("source", newInputValue);
              formik.setFieldTouched("source", true);
            }}
            onChange={(event, newValue) => {
              formik.setFieldValue("source", newValue ? newValue.value : "");
              formik.setFieldTouched("source", true);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="source"
                placeholder="Enter Source Location"
                error={formik.touched.source && Boolean(formik.errors.source)}
                helperText={formik.touched.source && formik.errors.source}
                size="small"
              />
            )}
          />
        </Grid>

        {/* Destination Autocomplete */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Destination</Typography>
          <Autocomplete
            fullWidth
            options={destinationOptions}
            getOptionLabel={(option) => option.label || ""}
            onInputChange={(event, newInputValue) => {
              fetchOptions(newInputValue, "destination");
              formik.setFieldValue("destination", newInputValue);
              formik.setFieldTouched("destination", true);
            }}
            onChange={(event, newValue) => {
              formik.setFieldValue(
                "destination",
                newValue ? newValue.value : ""
              );
              formik.setFieldTouched("destination", true);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="destination"
                placeholder="Enter Destination Location"
                error={
                  formik.touched.destination &&
                  Boolean(formik.errors.destination)
                }
                helperText={
                  formik.touched.destination && formik.errors.destination
                }
                size="small"
              />
            )}
          />
        </Grid>

        {/* Phone Field */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Phone</Typography>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            placeholder="Enter Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            size="small"
            disabled
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Button
              onClick={formik.resetForm}
              variant="contained"
              color="primary"
              size="small"
              disabled={
                !(formik.isValid && formik.dirty) || formik.isSubmitting
              } // Disable if form is invalid, untouched, or submitting
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={formik.handleSubmit}
              variant="contained"
              color="primary"
              size="small"
              disabled={
                !(formik.isValid && formik.dirty) || formik.isSubmitting
              } // Disable if form is invalid, untouched, or submitting
              sx={{ ml: 1 }}
            >
              {formik.isSubmitting ? "Adding trip..." : "Add trip"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddTrip;
