# Developer Guide

This guide is intended for developers who want to contribute to or extend the EventHarmony platform. It covers coding standards, development workflows, and best practices.

## Development Environment Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- MongoDB (v4 or higher)
- Git
- A code editor (VS Code, WebStorm, etc.)

### Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eventharmony.git
   cd eventharmony
   ```

2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Create `.env` files in both the `backend` and `frontend` directories based on the `.env.example` files.

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Project Structure

The project follows a standard structure for a MERN (MongoDB, Express, React, Node.js) stack application:

```
/
├── backend/               # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
│
├── frontend/              # React frontend application
│   ├── public/            # Static files
│   └── src/               # React source code
│       ├── components/    # Reusable components
│       ├── contexts/      # React contexts
│       ├── layouts/       # Page layouts
│       ├── locales/       # Translation files
│       ├── pages/         # Page components
│       ├── services/      # API services
│       ├── utils/         # Utility functions
│       └── App.js         # Main component
│
└── docs/                  # Documentation
```

## Coding Standards

### General Guidelines

- Follow the DRY (Don't Repeat Yourself) principle.
- Write self-documenting code with clear variable and function names.
- Add comments for complex logic or non-obvious behavior.
- Keep functions small and focused on a single responsibility.
- Write unit tests for critical functionality.

### JavaScript/Node.js Standards

- Use ES6+ features where appropriate.
- Use `const` for variables that don't change, and `let` for variables that do.
- Use arrow functions for callbacks and anonymous functions.
- Use async/await for asynchronous code instead of callbacks or promises.
- Use destructuring for objects and arrays.
- Use template literals for string interpolation.

### React Standards

- Use functional components with hooks instead of class components.
- Use the Context API for state management.
- Use custom hooks to extract reusable logic.
- Follow the React component naming convention (PascalCase).
- Keep components small and focused on a single responsibility.
- Use prop-types for type checking.

### CSS/Styling Standards

- Use Material-UI's styling system for consistent UI.
- Use theme variables for colors, spacing, and typography.
- Follow BEM (Block Element Modifier) naming convention for custom CSS classes.
- Use responsive design principles for mobile compatibility.

### API Standards

- Follow RESTful API design principles.
- Use HTTP methods appropriately (GET, POST, PUT, DELETE).
- Return consistent response formats.
- Include appropriate HTTP status codes.
- Validate input data on the server side.
- Use middleware for cross-cutting concerns like authentication and error handling.

## Development Workflow

### Git Workflow

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with descriptive commit messages:
   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

3. Push your branch to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a pull request on GitHub.

5. After review and approval, merge your pull request.

### Code Review Process

- All code changes must be reviewed by at least one other developer.
- Reviewers should check for:
  - Code quality and adherence to coding standards
  - Potential bugs or edge cases
  - Performance issues
  - Security vulnerabilities
  - Test coverage

### Testing

- Write unit tests for backend controllers, models, and utilities.
- Write unit tests for React components and hooks.
- Run tests before submitting a pull request:
  ```bash
  npm run test
  ```

- Aim for at least 70% test coverage for critical code paths.

## Backend Development

### Adding a New API Endpoint

1. Create a new controller function in the appropriate controller file:
   ```javascript
   // controllers/exampleController.js
   const Example = require('../models/Example');

   // @desc    Get all examples
   // @route   GET /api/examples
   // @access  Public
   exports.getExamples = async (req, res, next) => {
     try {
       const examples = await Example.find();
       
       res.status(200).json({
         success: true,
         count: examples.length,
         data: examples
       });
     } catch (err) {
       next(err);
     }
   };
   ```

2. Add the route in the appropriate route file:
   ```javascript
   // routes/examples.js
   const express = require('express');
   const { getExamples } = require('../controllers/exampleController');
   const { protect } = require('../middleware/auth');

   const router = express.Router();

   router.route('/').get(getExamples);

   module.exports = router;
   ```

3. Register the route in `server.js`:
   ```javascript
   // server.js
   const examples = require('./routes/examples');

   app.use('/api/examples', examples);
   ```

### Adding a New Model

1. Create a new model file in the `models` directory:
   ```javascript
   // models/Example.js
   const mongoose = require('mongoose');

   const ExampleSchema = new mongoose.Schema({
     name: {
       type: String,
       required: [true, 'Please add a name'],
       trim: true,
       maxlength: [50, 'Name cannot be more than 50 characters']
     },
     description: {
       type: String,
       required: [true, 'Please add a description'],
       maxlength: [500, 'Description cannot be more than 500 characters']
     },
     createdAt: {
       type: Date,
       default: Date.now
     }
   });

   module.exports = mongoose.model('Example', ExampleSchema);
   ```

### Adding Middleware

1. Create a new middleware file in the `middleware` directory:
   ```javascript
   // middleware/example.js
   const exampleMiddleware = (req, res, next) => {
     // Middleware logic here
     console.log('Example middleware executed');
     next();
   };

   module.exports = exampleMiddleware;
   ```

2. Use the middleware in routes:
   ```javascript
   // routes/examples.js
   const exampleMiddleware = require('../middleware/example');

   router.route('/').get(exampleMiddleware, getExamples);
   ```

## Frontend Development

### Adding a New Component

1. Create a new component file in the appropriate directory:
   ```jsx
   // components/common/ExampleComponent.js
   import React from 'react';
   import { Typography, Box } from '@mui/material';
   import { useTranslation } from 'react-i18next';

   const ExampleComponent = ({ title, description }) => {
     const { t } = useTranslation();

     return (
       <Box sx={{ padding: 2 }}>
         <Typography variant="h5">{title}</Typography>
         <Typography variant="body1">{description}</Typography>
         <Typography variant="body2">{t('common.example')}</Typography>
       </Box>
     );
   };

   export default ExampleComponent;
   ```

### Adding a New Page

1. Create a new page component in the `pages` directory:
   ```jsx
   // pages/example/ExamplePage.js
   import React from 'react';
   import { Container, Typography } from '@mui/material';
   import { useTranslation } from 'react-i18next';
   import ExampleComponent from '../../components/common/ExampleComponent';

   const ExamplePage = () => {
     const { t } = useTranslation();

     return (
       <Container maxWidth="lg">
         <Typography variant="h4" sx={{ mb: 3 }}>
           {t('example.title')}
         </Typography>
         <ExampleComponent 
           title={t('example.componentTitle')} 
           description={t('example.componentDescription')} 
         />
       </Container>
     );
   };

   export default ExamplePage;
   ```

2. Add the page to the routing configuration in `App.js`:
   ```jsx
   // App.js
   import ExamplePage from './pages/example/ExamplePage';

   // Inside the Routes component
   <Route path="/example" element={
     <ProtectedRoute>
       <MainLayout>
         <ExamplePage />
       </MainLayout>
     </ProtectedRoute>
   } />
   ```

### Adding Translations

1. Add new translation keys to the language files:
   ```json
   // locales/en.json
   {
     "example": {
       "title": "Example Page",
       "componentTitle": "Example Component",
       "componentDescription": "This is an example component."
     }
   }
   ```

   ```json
   // locales/fr.json
   {
     "example": {
       "title": "Page d'exemple",
       "componentTitle": "Composant d'exemple",
       "componentDescription": "Ceci est un composant d'exemple."
     }
   }
   ```

   ```json
   // locales/ar.json
   {
     "example": {
       "title": "صفحة مثال",
       "componentTitle": "مكون مثال",
       "componentDescription": "هذا مكون مثال."
     }
   }
   ```

### Adding a New Context

1. Create a new context file in the `contexts` directory:
   ```jsx
   // contexts/ExampleContext.js
   import React, { createContext, useState, useContext } from 'react';

   const ExampleContext = createContext();

   export const useExample = () => useContext(ExampleContext);

   export const ExampleProvider = ({ children }) => {
     const [exampleState, setExampleState] = useState('initial value');

     const updateExampleState = (newValue) => {
       setExampleState(newValue);
     };

     return (
       <ExampleContext.Provider value={{ exampleState, updateExampleState }}>
         {children}
       </ExampleContext.Provider>
     );
   };
   ```

2. Add the provider to the component tree in `index.js` or where appropriate:
   ```jsx
   // index.js
   import { ExampleProvider } from './contexts/ExampleContext';

   // Inside the render function
   <ExampleProvider>
     <App />
   </ExampleProvider>
   ```

## Performance Optimization

### Backend Optimization

- Use database indexing for frequently queried fields.
- Implement pagination for endpoints that return large datasets.
- Use caching for expensive operations.
- Optimize database queries to fetch only required fields.
- Use compression middleware for API responses.

### Frontend Optimization

- Use React.memo for components that render often but with the same props.
- Use lazy loading for components and routes.
- Optimize images and assets.
- Use code splitting to reduce initial bundle size.
- Implement virtualization for long lists.

## Security Best Practices

### Backend Security

- Validate and sanitize all user inputs.
- Use parameterized queries to prevent SQL injection.
- Implement rate limiting to prevent brute force attacks.
- Use HTTPS for all communications.
- Store sensitive information in environment variables.
- Hash passwords using bcrypt.
- Implement proper authentication and authorization.
- Use security headers (Helmet middleware).

### Frontend Security

- Sanitize user inputs to prevent XSS attacks.
- Use HTTPS for all API calls.
- Don't store sensitive information in local storage.
- Implement proper CSRF protection.
- Use Content Security Policy (CSP).

## Deployment

### Backend Deployment

1. Prepare the environment:
   - Set up production environment variables.
   - Configure MongoDB connection for production.

2. Build the application:
   ```bash
   cd backend
   npm run build
   ```

3. Deploy to your hosting provider (e.g., Heroku, AWS, DigitalOcean).

### Frontend Deployment

1. Build the React application:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the build folder to your hosting provider or CDN.

## Continuous Integration/Continuous Deployment (CI/CD)

- Set up GitHub Actions or another CI/CD service to automate testing and deployment.
- Configure the CI/CD pipeline to run tests, build the application, and deploy to staging/production environments.

## Troubleshooting

### Common Backend Issues

- **MongoDB Connection Errors**: Check your connection string and ensure MongoDB is running.
- **JWT Authentication Issues**: Verify the JWT secret and token expiration settings.
- **CORS Errors**: Ensure the CORS configuration includes all necessary origins.

### Common Frontend Issues

- **API Connection Errors**: Check the API URL in the frontend environment variables.
- **State Management Issues**: Use React DevTools to inspect component state and context values.
- **Rendering Performance**: Use the Performance tab in Chrome DevTools to identify bottlenecks.

## Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [i18next Documentation](https://www.i18next.com/)

## Contributing

Please refer to the [CONTRIBUTING.md](../CONTRIBUTING.md) file for detailed information on how to contribute to the project.