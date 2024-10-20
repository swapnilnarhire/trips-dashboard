import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
// import Button from '@mui/material/Button';
import LinearLoader from "./LinearLoader";
import CircularLoader from "./CircularLoader";

export default function Loader() {
  // const [open, setOpen] = React.useState(true);
  // const handleClose = () => {
  //   setOpen(false);
  // };
  // const handleToggle = () => {
  //   setOpen(!open);
  // };

  return (
    <div>
      {/* <Button onClick={handleToggle}>Show backdrop</Button> */}
      <LinearLoader />

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          // backgroundRepeat: "no-repeat",
          // backgroundSize: "cover",
        }}
        open={true}
        // onClick={handleClose}
      >
        <CircularLoader label={"feteching Data..."} />
      </Backdrop>
    </div>
  );
}
