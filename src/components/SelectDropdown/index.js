"use client";
import React from "react";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import InfoIcon from "@mui/icons-material/Info";
import { Typography } from "@mui/material";

const SelectDropdown = (props) => {
  const {
    options,
    infotext,
    handlechange,
    label,
    value,
    variant,
    name,
    error,
    helperText,
    id,
    required,
    disabled,
    size,
  } = props;

  return (
    <Box>
      <TextField
        select
        id={id || name}
        name={name}
        label={label}
        variant={variant}
        fullWidth
        value={value || ""}
        onChange={handlechange}
        InputProps={{
          endAdornment: infotext ? (
            <Box mr={3}>
              <Tooltip title={infotext}>
                <InfoIcon color="inherit" />
              </Tooltip>
            </Box>
          ) : null,
        }}
        helperText={helperText || " "}
        error={error || false}
        required={required || false}
        disabled={disabled || false}
        {...props}
        size={size || "medium"}
      >
        {options &&
          options.length > 0 &&
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Typography noWrap>{option.label}</Typography>
            </MenuItem>
          ))}
      </TextField>
    </Box>
  );
};

export default SelectDropdown;
