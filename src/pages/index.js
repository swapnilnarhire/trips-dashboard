import { Box, Button, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Trips Dashboard</title>
        <meta name="description" content="Shipments Web App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Typography variant="h3" gutterBottom>
          Welcome to Intugine
        </Typography>
        <Link href="/dashboard" passHref>
          <Button variant="contained" color="primary">
            Go to Dashboard
          </Button>
        </Link>
      </Box>
    </>
  );
}
