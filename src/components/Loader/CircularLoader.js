import React from "react";
import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material";

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme?.palette?.success?.dark || "inherit",
  position: "relative",
  zIndex: 1, // Make sure the loader has a lower z-index than the label
  "&::after": {
    content: "''",
    position: "absolute",
    top: "-6px",
    left: "-6px",
    right: "-6px",
    bottom: "-6px",
    borderRadius: "50%",
    border: `5px dotted ${theme?.palette?.info?.dark || "inherit"}`,
    animation: "$spin 1.5s linear infinite",
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "35%": {
      borderTopColor: "transparent",
      borderRightColor: theme?.palette?.secondary?.main || "inherit",
      borderBottomColor: theme?.palette?.secondary?.main || "inherit",
      borderLeftColor: "transparent",
      border: `20px double ${theme?.palette?.common?.black}`,
    },
    "50%": {
      borderTopColor: theme?.palette?.error?.light || "inherit",
      borderRightColor: "transparent",
      borderBottomColor: "transparent",
      borderLeftColor: theme?.palette?.error?.light || "inherit",
      border: `10px solid ${theme?.palette?.common?.red}`,
    },
    "75%": {
      borderTopColor: "transparent",
      borderRightColor: theme?.palette?.error?.dark || "inherit",
      borderBottomColor: theme?.palette?.error?.dark || "inherit",
      borderLeftColor: "transparent",
      border: `15px dashed ${theme?.palette?.common?.red}`,
    },
    "100%": {
      transform: "rotate(360deg)",
      borderTopColor: theme?.palette?.secondary?.light,
      borderRightColor: "transparent",
      borderBottomColor: "transparent",
      borderLeftColor: theme?.palette?.secondary?.light,
      border: `5px solid ${theme?.palette?.common?.red}`,
    },
  },
}));

const Label = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "white",
  fontWeight: "bold",
  fontSize: "24px",
  zIndex: 2, // Make sure the label has a higher z-index than the loader
}));

const CircularLoader = ({ label }) => {
  return (
    <StyledCircularProgress size={100} thickness={1}>
      {label && <Label>{label}</Label>}
      <Label>Loading...</Label>
    </StyledCircularProgress>
  );
};

export default CircularLoader;
