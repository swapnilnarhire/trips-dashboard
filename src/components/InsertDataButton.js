// Example React component to call the API

import React, { useEffect } from "react";

const InsertDataButton = () => {
  const insertData = async () => {
    try {
      const response = await fetch("/api/insertTrips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <button onClick={insertData}>Insert Trip Data</button>;
};

export default InsertDataButton;
