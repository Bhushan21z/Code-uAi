const PROBLEMS_DATA = {
    loginRegistrationSystem: {
      title: 'Login Page',
      description: 'Create a modern, responsive login and registration interface with client-side validation and interactive features.',
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
        'HTML5',
        'CSS3 with Flexbox/Grid',
        'Vanilla JavaScript',
        'Optional: Tailwind CSS for styling'
      ]
    },
    
    ecommerceHomepage: {
      title: 'E-commerce Homepage',
      description: 'Design and implement a modern, responsive e-commerce homepage with interactive product display and navigation.',
      uiRequirements: [
        'Mobile-first responsive design',
        'Responsive hamburger menu for mobile',
        'Navigation bar with dropdown menus',
        'Product grid with card layout',
        'Hover animations on product cards',
        'Responsive grid layout that adjusts to screen size'
      ],
      functionalRequirements: [
        'Search functionality',
        'Shopping cart icon with item count',
        'User account/login link',
        'Featured products section',
        'Category filters',
        'Clickable category filters',
        'Dynamically filter products without page reload',
        'Quick add to cart button'
      ],
      learningGoals: [
        'Create responsive mobile-first design',
        'Implement interactive product navigation',
        'Develop dynamic filtering functionality'
      ],
      preview: 'https://i.ibb.co/MDvnLvL/Screenshot-from-2024-12-15-20-55-26.png',
      testCases: [
        {
          scenario: 'Mobile view navigation',
          expectedBehavior: 'Hamburger menu appears, full menu collapses'
        },
        {
          scenario: 'Product card interaction',
          expectedBehavior: 'Hover effects, quick add to cart functionality'
        },
        {
          scenario: 'Category filtering',
          expectedBehavior: 'Dynamically filter products without page reload'
        }
      ],
      recommendedTechnologies: [
        'HTML5',
        'CSS Grid and Flexbox',
        'Vanilla JavaScript',
        'Optional: CSS animations'
      ]
    },
    
    interactiveChessGame: {
      title: 'Interactive Chess Board',
      description: 'Create a basic chess board with piece movement and basic game logic.',
      uiRequirements: [
        '8x8 chess board grid',
        'Hover effects on selectable pieces',
        'Highlight possible move squares',
        'Visual feedback for invalid moves',
        'Turn indicator',
        'Draggable chess pieces'
      ],
      functionalRequirements: [
        'Basic movement for pawns',
        'Restrict pieces to valid chess movement patterns',
        'Prevent moving to squares occupied by own pieces',
        'Simple capture mechanism',
        'Track current player turn',
        'Basic move validation',
        'Prevent illegal piece movements',
        'Simple check detection (optional)'
      ],
      learningGoals: [
        'Implement game board interaction',
        'Develop complex game logic',
        'Create interactive UI for game state'
      ],
      preview: 'https://i.ibb.co/MDvnLvL/Screenshot-from-2024-12-15-20-55-26.png',
      testCases: [
        {
          scenario: 'Pawn movement',
          expectedBehavior: 'Move forward, initial two-square move, capture diagonally'
        },
        {
          scenario: 'Piece selection',
          expectedBehavior: 'Highlight valid move squares, prevent invalid moves'
        },
        {
          scenario: 'Turn switching',
          expectedBehavior: 'Alternate between white and black players'
        }
      ],
      recommendedTechnologies: [
        'HTML5 Canvas or DOM-based board',
        'CSS for styling',
        'Vanilla JavaScript for game logic',
        'Drag and drop API'
      ]
    }
  };
  
  export default PROBLEMS_DATA;
