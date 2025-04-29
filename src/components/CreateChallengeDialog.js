import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  IconButton,
  Box,
  Typography,
  Grid,
  Chip,
  Avatar
} from "@mui/material";
import { Close, Code, Add } from "@mui/icons-material";

const CreateChallengeDialog = ({ 
  open, 
  onClose, 
  newChallenge, 
  onInputChange, 
  onArrayChange, 
  onAddTestCase, 
  onTestCaseChange,
  onCreateChallenge,
  difficultyLevels,
  challengeTypes,
  technologyOptions
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={newChallenge.title}
              onChange={onInputChange}
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={newChallenge.type}
                label="Type"
                onChange={onInputChange}
              >
                {challengeTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Difficulty</InputLabel>
              <Select
                name="difficulty"
                value={newChallenge.difficulty}
                label="Difficulty"
                onChange={onInputChange}
              >
                {difficultyLevels.map(level => (
                  <MenuItem key={level} value={level}>{level}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={newChallenge.description}
              onChange={onInputChange}
              margin="normal"
              multiline
              rows={3}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="GitHub Link"
              name="githubLink"
              value={newChallenge.githubLink}
              onChange={onInputChange}
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Preview Image URL"
              name="preview"
              value={newChallenge.preview}
              onChange={onInputChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tech Stack</InputLabel>
              <Select
                multiple
                name="techStack"
                value={newChallenge.techStack}
                onChange={(e) => onArrayChange(e, 'techStack')}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value} 
                        size="small"
                        avatar={<Avatar sx={{ width: 24, height: 24 }}>{value[0]}</Avatar>}
                      />
                    ))}
                  </Box>
                )}
              >
                {technologyOptions.map((tech) => (
                  <MenuItem key={tech} value={tech}>
                    <Checkbox checked={newChallenge.techStack.indexOf(tech) > -1} />
                    <ListItemText primary={tech} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Recommended Technologies</InputLabel>
              <Select
                multiple
                name="recommendedTechnologies"
                value={newChallenge.recommendedTechnologies}
                onChange={(e) => onArrayChange(e, 'recommendedTechnologies')}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value} 
                        size="small"
                        avatar={<Avatar sx={{ width: 24, height: 24 }}>{value[0]}</Avatar>}
                      />
                    ))}
                  </Box>
                )}
              >
                {technologyOptions.map((tech) => (
                  <MenuItem key={tech} value={tech}>
                    <Checkbox checked={newChallenge.recommendedTechnologies.indexOf(tech) > -1} />
                    <ListItemText primary={tech} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="UI Requirements (comma separated)"
              name="uiRequirements"
              value={newChallenge.uiRequirements.join(',')}
              onChange={(e) => onArrayChange(e, 'uiRequirements')}
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Functional Requirements (comma separated)"
              name="functionalRequirements"
              value={newChallenge.functionalRequirements.join(',')}
              onChange={(e) => onArrayChange(e, 'functionalRequirements')}
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Learning Goals (comma separated)"
              name="learningGoals"
              value={newChallenge.learningGoals.join(',')}
              onChange={(e) => onArrayChange(e, 'learningGoals')}
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Test Cases</Typography>
            {newChallenge.testCases.map((testCase, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <TextField
                  fullWidth
                  label="Scenario"
                  value={testCase.scenario}
                  onChange={(e) => onTestCaseChange(index, 'scenario', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Expected Behavior"
                  value={testCase.expectedBehavior}
                  onChange={(e) => onTestCaseChange(index, 'expectedBehavior', e.target.value)}
                  margin="normal"
                />
              </Box>
            ))}
            <Button onClick={onAddTestCase} variant="outlined" startIcon={<Add />}>
              Add Test Case
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button 
          onClick={onCreateChallenge} 
          variant="contained" 
          color="primary"
          startIcon={<Code />}
          sx={{ textTransform: 'none' }}
          disabled={!newChallenge.title || !newChallenge.description || !newChallenge.githubLink}
        >
          Create Challenge
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateChallengeDialog;