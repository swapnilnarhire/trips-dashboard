import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
} from "@mui/material";

import SelectDropdown from "@/components/SelectDropdown";
import CloseIcon from "@mui/icons-material/Close";

const validationSchema = Yup.object({
  status: Yup.string().required("Status is required"),
  date: Yup.date()
    .typeError("Invalid date format")
    .required("Date is required")
    .nullable(), // Allows the empty field to pass before setting a value
  // .min(new Date(), "Date must be in the future"), // Ensures that date is not in the past
});

export default function UpdateStatus({ open, onClose }) {
  const [statusOptions] = useState([
    { label: "Booked", value: "BKD" },
    { label: "In Transit", value: "INT" },
    { label: "Reached Destination", value: "RD" },
    { label: "Delivered", value: "DEL" },
  ]);

  const [loading, setLoading] = useState(false);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      date: "",
      status: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        console.log("Form values:", values);
        // Add your form submission logic here (API calls, etc.)
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <Box>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle>
          Update Status
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {/* Status Dropdown */}
              <Grid item xs={12}>
                <Typography variant="subtitle2">Status</Typography>
                <SelectDropdown
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={(e) =>
                    formik.setFieldValue("status", e.target.value)
                  }
                  variant="outlined"
                  size="small"
                  disabled={loading}
                  options={statusOptions}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                />
              </Grid>

              {/* Date Field */}
              <Grid item xs={12}>
                <Typography variant="subtitle2">Date</Typography>
                <TextField
                  type="datetime-local"
                  fullWidth
                  id="date"
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  size="small"
                  disabled={loading}
                />
              </Grid>

              {/* Submit Buttons */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    onClick={() => {
                      formik.resetForm();
                      onClose();
                    }}
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={loading}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={
                      !formik.isValid ||
                      formik.isSubmitting ||
                      !formik.dirty ||
                      loading
                    }
                    sx={{ ml: 1 }}
                  >
                    {loading ? "Updating status..." : "Update status"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
