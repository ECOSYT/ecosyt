# Security Policy

## Supported versions

The default supported branch is `main`.

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub Security Advisories:

- https://github.com/ECOSYT/ecosyt/security/advisories/new

Do not open a public issue for an active vulnerability.

## Security controls in this repository

- CodeQL analysis on pull requests, pushes to protected branches, and scheduled scans
- Dependency audit gate in CI
- Secret scanning in CI (gitleaks) + local pre-commit secret scanning
- Protected branch policy codified in `.github/settings.yml`
- Dependabot updates for npm and GitHub Actions
