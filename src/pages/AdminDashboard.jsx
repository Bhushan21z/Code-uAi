import React from "react";
import { Box, Tabs, Tab } from "@mui/material";

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: 3 }}>
      <Tabs value={tabIndex} onChange={handleChange} centered>
        <Tab label="Problems" />
        <Tab label="Create Custom Assessment" />
        <Tab label="Dashboard (Coming Soon)" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <>Problems</>}
        {tabIndex === 1 && <>Create Custom Assessment</>}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
