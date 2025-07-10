# Contributing to EventHarmony

Thank you for considering contributing to EventHarmony! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue tracker to see if the problem has already been reported. If it has and the issue is still open, add a comment to the existing issue instead of opening a new one.

When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots or animated GIFs if possible**
- **Include details about your configuration and environment**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When you are creating an enhancement suggestion, please include as many details as possible:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful to most users**
- **List some other applications where this enhancement exists, if applicable**

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Include screenshots and animated GIFs in your pull request whenever possible
- Follow the JavaScript and React styleguides
- Include thoughtfully-worded, well-structured tests
- Document new code
- End all files with a newline

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

All JavaScript code is linted with ESLint and formatted with Prettier. Run `npm run lint` to check your code.

### React Styleguide

- Use functional components with hooks instead of class components
- Use the file naming convention: `ComponentName.js`
- Place components in appropriate directories based on their purpose
- Use prop-types for type checking

### Documentation Styleguide

- Use Markdown for documentation
- Reference methods and classes in markdown with backticks: \`methodName()\` or \`ClassName\`
- Use code blocks for examples

## Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Setting Up Development Environment

1. Clone your fork of the repository
2. Install dependencies with `npm run install-all`
3. Create a `.env` file based on `.env.example` in both frontend and backend directories
4. Run the development server with `npm run dev`

Thank you for contributing to EventHarmony!