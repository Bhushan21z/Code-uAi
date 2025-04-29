import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import AdminProblems from "../components/AdminProblems";
import UserChallenges from "../components/UserChallenges";

const AdminDashboard = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabIndex} onChange={handleChange} centered>
        <Tab label="Problems" />
        <Tab label="User Challenges" />
      </Tabs>
      
      <Box sx={{ p: 3 }}>
        {tabIndex === 0 && <AdminProblems />}
        {tabIndex === 1 && <UserChallenges />}
      </Box>
    </Box>
  );
};

export default AdminDashboard;