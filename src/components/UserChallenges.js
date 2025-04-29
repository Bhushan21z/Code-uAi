import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select
} from "@mui/material";
import { Add, Close, Delete, Visibility, Summarize } from "@mui/icons-material";

const UserChallenges = () => {
  const [userChallenges, setUserChallenges] = useState([]);
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [openSummaryDialog, setOpenSummaryDialog] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState("");

  useEffect(() => {
    fetchUserChallenges();
    fetchUsers();
    fetchChallenges();
  }, []);

  const fetchUserChallenges = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/userChallenges/all');
      const data = await response.json();
      setUserChallenges(data.data);
    } catch (error) {
      showSnackbar("Failed to fetch user challenges", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      showSnackbar("Failed to fetch users", "error");
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/challenges');
      const data = await response.json();
      setChallenges(data.data);
    } catch (error) {
      showSnackbar("Failed to fetch challenges", "error");
    }
  };

  const handleCreateUserChallenge = async () => {
    if (!selectedUser || !selectedChallenge) {
      showSnackbar("Please select both user and challenge", "error");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/userChallenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: selectedUser.email,
          challengeId: selectedChallenge._id,
          status: "pending" // Default status
        }),
      });

      if (response.ok) {
        showSnackbar("User assigned to challenge successfully", "success");
        fetchUserChallenges();
        setOpenDialog(false);
        setSelectedUser(null);
        setSelectedChallenge(null);
      } else {
        const errorData = await response.json();
        showSnackbar(errorData.error || "Failed to assign user to challenge", "error");
      }
    } catch (error) {
      showSnackbar("An error occurred while assigning user to challenge", "error");
    }
  };

  const handleDeleteUserChallenge = async (userEmail, challengeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/userChallenges/all`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, challengeId })
      });

      if (response.ok) {
        showSnackbar("User challenge removed successfully", "success");
        fetchUserChallenges();
      } else {
        const errorData = await response.json();
        showSnackbar(errorData.error || "Failed to remove user challenge", "error");
      }
    } catch (error) {
      showSnackbar("An error occurred while removing user challenge", "error");
    }
  };

  const handleStatusChange = async (userEmail, challengeId, newStatus) => {
    try {
      const response = await fetch('http://localhost:5000/api/userChallenges/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          challengeId,
          status: newStatus
        }),
      });

      if (response.ok) {
        showSnackbar("Status updated successfully", "success");
        fetchUserChallenges();
      } else {
        const errorData = await response.json();
        showSnackbar(errorData.error || "Failed to update status", "error");
      }
    } catch (error) {
      showSnackbar("An error occurred while updating status", "error");
    }
  };

  const handleGenerateSummary = async (userEmail, challengeId) => {
    try {
      // Call your API to generate summary
      const response = await fetch('http://localhost:5000/api/userChallenges/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          challengeId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showSnackbar("Summary generated successfully", "success");
        fetchUserChallenges();
        // You might want to show the summary immediately
        setSelectedSummary(data.summary);
        setOpenSummaryDialog(true);
      } else {
        const errorData = await response.json();
        showSnackbar(errorData.error || "Failed to generate summary", "error");
      }
    } catch (error) {
      showSnackbar("An error occurred while generating summary", "error");
    }
  };

  const handleViewSummary = async (userEmail, challengeId) => {
    try {
      // Call your API to get summary
      const response = await fetch(`http://localhost:5000/api/userChallenges/summary?email=${userEmail}&challengeId=${challengeId}`);
      
      if (response.ok) {
        const data = await response.json();
        setSelectedSummary(data.summary);
        setOpenSummaryDialog(true);
      } else {
        const errorData = await response.json();
        showSnackbar(errorData.error || "Failed to fetch summary", "error");
      }
    } catch (error) {
      showSnackbar("An error occurred while fetching summary", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'in-progress': return 'warning';
      case 'completed': return 'primary';
      case 'result-generated': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          User Challenges
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{ textTransform: 'none' }}
        >
          Assign Challenge
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>User Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Challenge</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Summary</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userChallenges.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No user challenges found
                      </TableCell>
                    </TableRow>
                  ) : (
                    userChallenges.map((uc, index) => (
                      <TableRow key={index}>
                        <TableCell>{uc.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={uc.challenge} 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={uc.status || 'pending'}
                            onChange={(e) => handleStatusChange(uc.email, uc.challengeId, e.target.value)}
                            size="small"
                            sx={{ minWidth: 120 }}
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in-progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="result-generated">Result Generated</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {uc.status === 'completed' && (
                            <Button
                              variant="outlined"
                              startIcon={<Summarize />}
                              onClick={() => handleGenerateSummary(uc.email, uc.challengeId)}
                              size="small"
                              sx={{ textTransform: 'none' }}
                            >
                              Generate
                            </Button>
                          )}
                          {uc.status === 'result-generated' && (
                            <Button
                              variant="outlined"
                              startIcon={<Visibility />}
                              onClick={() => handleViewSummary(uc.email, uc.challengeId)}
                              size="small"
                              sx={{ textTransform: 'none' }}
                            >
                              View
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteUserChallenge(uc.email, uc.challengeId)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Assign Challenge Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Assign Challenge to User
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Autocomplete
              options={users}
              getOptionLabel={(user) => user.email}
              onChange={(event, value) => setSelectedUser(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select User"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />
              )}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Autocomplete
              options={challenges}
              getOptionLabel={(challenge) => challenge.title}
              onChange={(event, value) => setSelectedChallenge(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Challenge"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateUserChallenge}
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
            disabled={!selectedUser || !selectedChallenge}
          >
            Assign Challenge
          </Button>
        </DialogActions>
      </Dialog>

      {/* Summary Dialog */}
      <Dialog open={openSummaryDialog} onClose={() => setOpenSummaryDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'primary.main',
          color: 'white'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Challenge Summary
          </Typography>
          <IconButton onClick={() => setOpenSummaryDialog(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="body1" whiteSpace="pre-wrap">
              {selectedSummary || "No summary available"}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSummaryDialog(false)} sx={{ textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserChallenges;