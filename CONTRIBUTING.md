# Contributing to TRACE Protocol

Thank you for your interest in contributing to TRACE Protocol! This document provides guidelines for contributing to the project.

## 🎯 How to Contribute

### Reporting Issues
- Use GitHub Issues for bug reports and feature requests
- Include clear reproduction steps for bugs
- Provide context about your environment (OS, Node.js/Python versions)

### Feature Proposals
- Open an issue with the `enhancement` label
- Describe the use case and expected behavior
- Consider backwards compatibility implications

### Code Contributions
- Fork the repository and create a feature branch
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed

## 🏗️ Development Setup

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.9
- Git

### Local Development
```bash
# Clone and setup
git clone https://github.com/your-org/trace-protocol.git
cd trace-protocol

# Install server dependencies
cd server && npm install && cd ..

# Install TypeScript SDK
cd sdk/packages/client && npm install && npm run build && cd ../../..

# Install Python SDK
pip install -e ./sdk/python/trace_client
```

### Running Tests
```bash
# TypeScript SDK tests
cd sdk/packages/client && npm test

# Python SDK tests
cd sdk/python/trace_client && python -m pytest

# End-to-end tests
./scripts/e2e.sh
```

## 📋 RFC Process

For significant changes, we follow an RFC (Request for Comments) process:

1. **Create an RFC Issue**: Use the `rfc` label and follow the RFC template
2. **Community Discussion**: Allow time for community feedback (minimum 1 week)
3. **Implementation**: Once approved, implement the changes
4. **Documentation**: Update relevant documentation and examples

### RFC Template
```markdown
## Summary
Brief description of the proposed change.

## Motivation
Why is this change needed? What problem does it solve?

## Detailed Design
Technical details of the implementation.

## Backwards Compatibility
How does this affect existing code?

## Implementation Plan
Step-by-step implementation approach.

## Alternatives Considered
Other approaches that were considered and why they were rejected.
```

## 🧪 Testing Guidelines

### Test Coverage
- Aim for >80% code coverage
- Include both unit and integration tests
- Test error conditions and edge cases

### Test Structure
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies appropriately

### Example Test Structure
```typescript
describe('TraceClient', () => {
  describe('propose', () => {
    it('should return decision with approval requirement', async () => {
      // Arrange
      const client = new TraceClient({ endpoint: 'http://localhost:8787' });
      
      // Act
      const decision = await client.propose({
        type: 'send_email',
        actor: { kind: 'agent', name: 'test-bot' }
      });
      
      // Assert
      expect(decision.status).toBe('requires_approval');
    });
  });
});
```

## 📝 Code Style

### TypeScript/JavaScript
- Use TypeScript strict mode
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Python
- Follow PEP 8 style guidelines
- Use type hints for function parameters and return values
- Add docstrings for all public functions and classes

### General
- Use conventional commit messages
- Keep functions focused and small
- Prefer composition over inheritance
- Write self-documenting code

## 🔄 Pull Request Process

1. **Create Branch**: Create a feature branch from `main`
2. **Make Changes**: Implement your changes with tests
3. **Update Documentation**: Update README, examples, or API docs as needed
4. **Submit PR**: Create a pull request with a clear description
5. **Code Review**: Address feedback from maintainers
6. **Merge**: Once approved, maintainers will merge your changes

### PR Template
```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for new functionality
- [ ] Updated existing tests if needed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

## 🏷️ Release Process

Releases follow semantic versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Release Checklist
- [ ] Update version numbers in package.json/pyproject.toml
- [ ] Update CHANGELOG.md with new features/fixes
- [ ] Run full test suite
- [ ] Build and test distribution packages
- [ ] Create GitHub release with release notes
- [ ] Publish to npm/PyPI

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the golden rule

### Communication
- Use GitHub Issues for technical discussions
- Keep discussions focused and on-topic
- Be patient with questions and responses
- Help newcomers get started

## 📚 Resources

- [TRACE Protocol Documentation](https://traceprotocol.org/)
- [Technical Specification](https://traceprotocol.org/spec.html)
- [OpenAPI Specification](openapi.yaml)
- [Examples Directory](examples/)

## 🆘 Getting Help

- **Documentation**: Check the website and examples first
- **Issues**: Search existing GitHub issues
- **Discussions**: Use GitHub Discussions for questions
- **Community**: Join our community channels (if available)

---

Thank you for contributing to TRACE Protocol! Together, we're building a more accountable future for autonomous systems.
