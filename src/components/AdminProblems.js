import React, { useState, useEffect } from "react";
import { 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Typography, 
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  DialogActions,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Code,
  GitHub,
  Visibility,
  Add,
  Close,
  Star,
  Schedule,
  Computer,
  School,
  BugReport,
  CheckCircle,
  DesignServices
} from "@mui/icons-material";
import { backendUrl } from '../Constants/constants';
import CreateChallengeDialog from "./CreateChallengeDialog";

const AdminProblems = () => {
  const [challenges, setChallenges] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    type: "frontend",
    time: "60",
    techStack: [],
    githubLink: "",
    description: "",
    uiRequirements: [],
    difficulty: "Beginner",
    functionalRequirements: [],
    learningGoals: [],
    preview: "",
    testCases: [],
    recommendedTechnologies: []
  });

  const difficultyLevels = ["Beginner", "Intermediate", "Hard"];
  const challengeTypes = ["frontend", "backend", "fullstack"];
  const technologyOptions = ["React", "Vue", "Angular", "Node.js", "Express", "MongoDB"];

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/challenges`);
      const data = await response.json();
      setChallenges(data.data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handleCreateChallenge = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/challenges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChallenge),
      });
      
      if (response.ok) {
        fetchChallenges();
        setOpenDialog(false);
        setNewChallenge({
          title: "",
          type: "frontend",
          time: "60",
          techStack: [],
          githubLink: "",
          description: "",
          uiRequirements: [],
          difficulty: "Beginner",
          functionalRequirements: [],
          learningGoals: [],
          preview: "",
          testCases: [],
          recommendedTechnologies: []
        });
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChallenge(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    setNewChallenge(prev => ({ 
      ...prev, 
      [field]: typeof value === 'string' ? value.split(',') : value 
    }));
  };

  const handleAddTestCase = () => {
    setNewChallenge(prev => ({
      ...prev,
      testCases: [...prev.testCases, { scenario: "", expectedBehavior: "" }]
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...newChallenge.testCases];
    updatedTestCases[index][field] = value;
    setNewChallenge(prev => ({ ...prev, testCases: updatedTestCases }));
  };

  const handleViewDetails = (challenge) => {
    setSelectedChallenge(challenge);
    setOpenDetailsDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {challenges.map((challenge, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}>
              {challenge.preview && (
                <Box sx={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={challenge.preview} 
                    alt={challenge.title} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: 'brightness(0.95)'
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1
                  }}>
                    <Chip 
                      label={challenge.difficulty} 
                      color={
                        challenge.difficulty === "Beginner" ? "success" : 
                        challenge.difficulty === "Intermediate" ? "warning" : "error"
                      } 
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {challenge.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Computer color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Schedule color="action" sx={{ mr: 1, fontSize: '1rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    {challenge.time} minutes
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {challenge.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {challenge.techStack.map((tech, i) => (
                    <Chip 
                      key={i} 
                      label={tech} 
                      size="small" 
                      variant="outlined"
                      avatar={<Avatar sx={{ width: 24, height: 24 }}>{tech[0]}</Avatar>}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button 
                  size="small" 
                  startIcon={<Visibility />}
                  onClick={() => handleViewDetails(challenge)}
                  sx={{ textTransform: 'none' }}
                >
                  View Details
                </Button>
                <Tooltip title="GitHub Repository">
                  <IconButton 
                    href={challenge.githubLink} 
                    target="_blank"
                    size="small"
                    color="primary"
                  >
                    <GitHub />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
        
        {/* Add New Challenge Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              border: '2px dashed',
              borderColor: 'divider',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                transform: 'translateY(-5px)'
              }
            }}
            onClick={() => setOpenDialog(true)}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              gap: 1
            }}>
              <Add color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="h6" color="primary">
                Create New Challenge
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add a new coding challenge to your collection
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Challenge Details Dialog */}
      <Dialog 
        open={openDetailsDialog} 
        onClose={() => setOpenDetailsDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        {selectedChallenge && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'primary.main',
              color: 'white'
            }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {selectedChallenge.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip 
                    label={selectedChallenge.type} 
                    color="default" 
                    size="small"
                    sx={{ 
                      backgroundColor: 'white',
                      color: 'primary.main',
                      fontWeight: 'bold'
                    }}
                  />
                  <Chip 
                    label={selectedChallenge.difficulty} 
                    color={
                      selectedChallenge.difficulty === "Beginner" ? "success" : 
                      selectedChallenge.difficulty === "Intermediate" ? "warning" : "error"
                    } 
                    size="small"
                    sx={{ fontWeight: 'bold', color: 'white' }}
                  />
                  <Chip 
                    label={`${selectedChallenge.time} mins`} 
                    color="default" 
                    size="small"
                    icon={<Schedule fontSize="small" />}
                    sx={{ 
                      backgroundColor: 'white',
                      color: 'primary.main'
                    }}
                  />
                </Box>
              </Box>
              <IconButton 
                onClick={() => setOpenDetailsDialog(false)} 
                sx={{ color: 'white' }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Description
                    </Typography>
                    <Typography paragraph>
                      {selectedChallenge.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Preview
                    </Typography>
                    <img 
                      src={selectedChallenge.preview} 
                      alt={selectedChallenge.title} 
                      style={{ 
                        width: '100%', 
                        borderRadius: 8,
                        border: '1px solid #e0e0e0'
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      GitHub Repository
                    </Typography>
                    <Button
                      href={selectedChallenge.githubLink}
                      target="_blank"
                      variant="outlined"
                      startIcon={<GitHub />}
                      sx={{ textTransform: 'none' }}
                    >
                      View on GitHub
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Tech Stack
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedChallenge.techStack.map((tech, i) => (
                        <Chip 
                          key={i} 
                          label={tech} 
                          size="medium"
                          avatar={<Avatar sx={{ width: 24, height: 24 }}>{tech[0]}</Avatar>}
                          sx={{ fontWeight: 'bold' }}
                        />
                      ))}
                    </Box>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      UI Requirements
                    </Typography>
                    <List dense>
                      {selectedChallenge.uiRequirements.map((req, i) => (
                        <ListItem key={i} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <DesignServices color="primary" fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="body2">{req}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Functional Requirements
                    </Typography>
                    <List dense>
                      {selectedChallenge.functionalRequirements.map((req, i) => (
                        <ListItem key={i} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle color="primary" fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="body2">{req}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Learning Goals
                    </Typography>
                    <List dense>
                      {selectedChallenge.learningGoals.map((goal, i) => (
                        <ListItem key={i} sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <School color="primary" fontSize="small" />
                          </ListItemIcon>
                          <Typography variant="body2">{goal}</Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Test Cases
                    </Typography>
                    {selectedChallenge.testCases.map((testCase, i) => (
                      <Box key={i} sx={{ mb: 2, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          <BugReport color="error" fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Scenario {i + 1}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 4, mb: 1 }}>
                          {testCase.scenario}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          <Star color="warning" fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Expected Behavior
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 4 }}>
                          {testCase.expectedBehavior}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Create Challenge Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          backgroundColor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Create New Challenge
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 3 }}>
            <CreateChallengeDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                newChallenge={newChallenge}
                onInputChange={handleInputChange}
                onArrayChange={handleArrayChange}
                onAddTestCase={handleAddTestCase}
                onTestCaseChange={handleTestCaseChange}
                onCreateChallenge={handleCreateChallenge}
                difficultyLevels={difficultyLevels}
                challengeTypes={challengeTypes}
                technologyOptions={technologyOptions}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateChallenge} 
            variant="contained" 
            color="primary"
            startIcon={<Code />}
            sx={{ textTransform: 'none' }}
          >
            Create Challenge
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProblems;