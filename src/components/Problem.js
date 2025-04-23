import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  List, 
  ListItem, 
  Chip,
  Divider,
  Button,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  CodeRounded,
  SchoolRounded,
  TaskAltRounded,
  BugReportRounded,
  ImageRounded,
  ExpandMoreRounded,
  CheckCircleOutlineRounded
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ProblemsComponent = ({ problem, problemKey, onFinishChallenge }) => {
  const theme = useTheme();
  const [expandedSections, setExpandedSections] = React.useState({
    description: true,
    ui: true,
    functional: true,
    learning: true,
    tests: true,
    tech: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
  };

  const SectionHeader = ({ icon, title, section }) => (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        mb: 2,
        '&:hover': {
          opacity: 0.9
        }
      }}
      onClick={() => toggleSection(section)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {icon}
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          color: theme.palette.primary.light
        }}>
          {title}
        </Typography>
      </Box>
      <motion.div
        animate={{ rotate: expandedSections[section] ? 0 : 180 }}
        transition={{ duration: 0.2 }}
      >
        <ExpandMoreRounded />
      </motion.div>
    </Box>
  );

  const RequirementItem = ({ text }) => (
    <ListItem sx={{ px: 0, py: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <CheckCircleOutlineRounded sx={{ 
          fontSize: '1rem', 
          color: theme.palette.success.light,
          mt: '2px'
        }} />
        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
          {text}
        </Typography>
      </Box>
    </ListItem>
  );

  return (
    <Box sx={{
      p: 3,
      height: '100%',
      overflowY: 'auto',
      background: 'linear-gradient(135deg, #0A0A23 0%, #1a1a1a 100%)',
      color: '#e0e0e0',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#2a2a2a',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#444',
        borderRadius: '3px',
      },
    }}>
      {/* Header */}
      <Box sx={{ 
        mb: 4,
        pb: 2,
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          color: '#fff',
          mb: 1,
          letterSpacing: '0.5px'
        }}>
          {problem.title}
        </Typography>
        <Chip 
          label={problem.difficulty || 'Intermediate'} 
          size="small"
          sx={{ 
            bgcolor: '#333', 
            color: '#fff',
            fontWeight: 500
          }}
        />
      </Box>

      {/* Description */}
      <Card sx={{ 
        mb: 3, 
        bgcolor: '#252525',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px'
      }}>
        <Card sx={{ p: 2.5, bgcolor: 'transparent', boxShadow: 'none' }}>
          <SectionHeader 
            icon={<BugReportRounded sx={{ color: theme.palette.error.light }} />}
            title="Problem Description"
            section="description"
          />
          {expandedSections.description && (
            <Typography variant="body1" sx={{ 
              lineHeight: 1.7,
              color: '#cfcfcf'
            }}>
              {problem.description}
            </Typography>
          )}
        </Card>
      </Card>

      {/* Preview Image */}
      {problemKey !== 'express-api' && problem.preview && (
        <Card sx={{ 
          mb: 3, 
          bgcolor: '#252525',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px'
        }}>
          <Card sx={{ p: 2.5, bgcolor: 'transparent', boxShadow: 'none' }}>
            <SectionHeader 
              icon={<ImageRounded sx={{ color: theme.palette.info.light }} />}
              title="UI Preview"
              section="preview"
            />
            {expandedSections.preview && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                borderRadius: '4px',
                overflow: 'hidden',
                mt: 1
              }}>
                <img 
                  src={problem.preview}
                  alt={`${problem.title} Preview`} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '300px', 
                    objectFit: 'contain',
                    borderRadius: '4px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
                  }} 
                />
              </Box>
            )}
          </Card>
        </Card>
      )}

      {/* UI Requirements */}
      {problemKey !== 'express-api' && problem.uiRequirements && (
        <Card sx={{ 
          mb: 3, 
          bgcolor: '#252525',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px'
        }}>
          <Card sx={{ p: 2.5, bgcolor: 'transparent', boxShadow: 'none' }}>
            <SectionHeader 
              icon={<TaskAltRounded sx={{ color: theme.palette.success.light }} />}
              title="UI Requirements"
              section="ui"
            />
            {expandedSections.ui && (
              <List dense sx={{ px: 0, color: '#fff' }}>
                {problem.uiRequirements.map((requirement, index) => (
                  <RequirementItem key={index} text={requirement} />
                ))}
              </List>
            )}
          </Card>
        </Card>
      )}

      {/* Functional Requirements */}
      <Card sx={{ 
        mb: 3, 
        bgcolor: '#252525',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px'
      }}>
        <Card sx={{ p: 2.5, bgcolor: 'transparent', boxShadow: 'none' }}>
          <SectionHeader 
            icon={<TaskAltRounded sx={{ color: theme.palette.success.light }} />}
            title="Functional Requirements"
            section="functional"
          />
          {expandedSections.functional && (
            <List dense sx={{ px: 0, color: '#fff' }}>
              {problem.functionalRequirements.map((requirement, index) => (
                <RequirementItem key={index} text={requirement} />
              ))}
            </List>
          )}
        </Card>
      </Card>

      {/* Learning Goals */}
      <Card sx={{ 
        mb: 3, 
        bgcolor: '#252525',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px'
      }}>
        <Card sx={{ p: 2.5, bgcolor: 'transparent', boxShadow: 'none' }}>
          <SectionHeader 
            icon={<SchoolRounded sx={{ color: theme.palette.warning.light }} />}
            title="Learning Goals"
            section="learning"
          />
          {expandedSections.learning && (
            <List dense sx={{ px: 0, color: '#fff' }}>
              {problem.learningGoals.map((goal, index) => (
                <RequirementItem key={index} text={goal} />
              ))}
            </List>
          )}
        </Card>
      </Card>

      {/* Test Cases */}
      <Card sx={{ 
        mb: 3, 
        bgcolor: '#252525',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px'
      }}>
        <Card sx={{ p: 2.5, bgcolor: 'transparent', boxShadow: 'none' }}>
          <SectionHeader 
            icon={<CodeRounded sx={{ color: theme.palette.secondary.light }} />}
            title="Test Cases"
            section="tests"
          />
          {expandedSections.tests && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              mt: 1
            }}>
              {problem.testCases.map((testCase, index) => (
                <Card 
                  key={index} 
                  variant="outlined"
                  sx={{ 
                    bgcolor: '#333',
                    borderColor: '#444',
                    borderRadius: '6px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600,
                      color: '#fff',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Box sx={{ 
                        width: '20px',
                        height: '20px',
                        bgcolor: theme.palette.primary.dark,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </Box>
                      Test Case
                    </Typography>
                    <Divider sx={{ borderColor: '#444', my: 1 }} />
                    <Typography variant="body2" sx={{ 
                      color: '#bbb',
                      mb: 1.5,
                      fontStyle: 'italic'
                    }}>
                      {testCase.scenario}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cfcfcf' }}>
                      <Box component="span" sx={{ 
                        color: theme.palette.success.light,
                        fontWeight: 500
                      }}>
                        Expected:
                      </Box> {testCase.expectedBehavior}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
        </Card>
      </Card>

      {/* Recommended Technologies */}
      <Card sx={{ 
        mb: 3, 
        bgcolor: '#252525',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderRadius: '8px'
      }}>
        <Card sx={{ p: 2.5, bgcolor: 'transparent', boxShadow: 'none' }}>
          <SectionHeader 
            icon={<CodeRounded sx={{ color: theme.palette.secondary.light }} />}
            title="Recommended Technologies"
            section="tech"
          />
          {expandedSections.tech && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {problem.recommendedTechnologies.map((tech, index) => (
                <Chip 
                  key={index} 
                  label={tech} 
                  size="small"
                  sx={{ 
                    bgcolor: '#333',
                    color: '#fff',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: '#3a3a3a'
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Card>
      </Card>

      {/* Finish Button */}
      {onFinishChallenge && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 4,
          mb: 2
        }}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={onFinishChallenge}
              sx={{
                px: 5,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '8px',
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)'
                }
              }}
            >
              Finish Challenge
            </Button>
          </motion.div>
        </Box>
      )}
    </Box>
  );
};

export default ProblemsComponent;