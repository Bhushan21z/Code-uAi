const REACT_PROBLEMS_DATA = {
    loginRegistrationSystem: {
      title: 'Login Page',
      description: 'Create a modern, responsive login and registration interface with client-side validation and interactive features. Also modify UI as shown in the preview.',
      uiRequirements: [
        'Responsive design for mobile and desktop',
        'Smooth form transitions',
        'Error message animations',
        'Password strength indicator',
        'Show/hide password toggle'
      ],
      functionalRequirements: [
        'Client-side email format validation',
        'Email must be a valid format',
        'Email cannot be empty',
        'Maximum 100 characters for email',
        'Password minimum 8 characters',
        'Password must contain at least one uppercase letter',
        'Password must contain at least one number',
        'Password must contain at least one special character',
        'Real-time password match validation',
        'Disabled submit button until all validations pass'
      ],
      learningGoals: [
        'Implement form validation',
        'Create responsive design',
        'Handle user interaction states'
      ],
      preview: 'https://i.ibb.co/MDvnLvL/Screenshot-from-2024-12-15-20-55-26.png',
      testCases: [
        {
          scenario: 'Valid login credentials',
          expectedBehavior: 'Successfully log in and redirect to dashboard'
        },
        {
          scenario: 'Invalid email format',
          expectedBehavior: 'Show specific email format error'
        },
        {
          scenario: 'Weak password',
          expectedBehavior: 'Display password strength warning'
        }
      ],
      recommendedTechnologies: [
        'React'
      ]
    },
  };
  
  export default REACT_PROBLEMS_DATA;
