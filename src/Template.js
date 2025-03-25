const dummyHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Static Template</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Hello, Static World!</h1>
        <p class="description">This is a sample static template</p>
        <button id="clickMe">Click Me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`;

const dummyCSS = `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
    color: #333;
    text-align: center;
}

.description {
    color: #666;
    text-align: center;
    line-height: 1.6;
}

button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #45a049;
}`;

const dummyJS = `
document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('clickMe');
    let clickCount = 0;

    button.addEventListener('click', function() {
        clickCount++;
        console.log(\`Button clicked \${clickCount} time\${clickCount === 1 ? '' : 's'}!\`);
        
        this.textContent = \`Clicked \${clickCount} time\${clickCount === 1 ? '' : 's'}!\`;
        
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });

    console.log('Static template loaded and ready!');
});`;

const dummyReact = `import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div>
        <button onClick={() => setShowLogin(true)} style={{ marginRight: '10px' }}>
          Login
        </button>
        <button onClick={() => setShowLogin(false)}>
          Register
        </button>
      </div>
      {showLogin ? <Login /> : <Register />}
    </div>
  );
}

export default App;`;

const dummyLogin = `export function Login() {
  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Login</h2>
      <input type="text" placeholder="Username" style={{ display: 'block', margin: '10px auto' }} />
      <input type="password" placeholder="Password" style={{ display: 'block', margin: '10px auto' }} />
      <button>Login</button>
    </div>
  );
}`

const dummyRegister = `export function Register() {
  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Register</h2>
      <input type="text" placeholder="Username" style={{ display: 'block', margin: '10px auto' }} />
      <input type="email" placeholder="Email" style={{ display: 'block', margin: '10px auto' }} />
      <input type="password" placeholder="Password" style={{ display: 'block', margin: '10px auto' }} />
      <button>Register</button>
    </div>
  );
}`;

const TEMPLATES = {
  static: {
    files: {
      "/index.html": {
        code: dummyHTML,
        active: true
      },
      "/styles.css": {
        code: dummyCSS
      },
      "/script.js": {
        code: dummyJS,
      }
    }
  },
  react: {
    files: {
      "/App.js": {
        code: dummyReact,
        active: true
      },
      "/Register.js": {
        code: dummyRegister,
      },
      "/Login.js": {
        code: dummyLogin,
      }
    }
  }
};

export default TEMPLATES;
