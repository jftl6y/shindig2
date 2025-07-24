<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Shindig RSVP Application - Copilot Instructions

This is an Angular application for party RSVPs with Azure Storage Table integration.

## Project Context

- **Framework**: Angular 18 with standalone components
- **Azure Integration**: Uses @azure/data-tables SDK for storing RSVP responses
- **Styling**: CSS with modern gradients and responsive design
- **Authentication**: Azure Storage Account Key (can be upgraded to Managed Identity)

## Key Components

- `app.component.ts`: Main RSVP form and party details display
- `rsvp.service.ts`: Azure Storage Table integration service
- Environment files: Store Azure Storage configuration

## Development Guidelines

1. **Azure Best Practices**: Always use Managed Identity in production, never hardcode credentials
2. **Error Handling**: Implement comprehensive error handling for Azure Storage operations
3. **Responsive Design**: Ensure all UI components work on mobile devices
4. **TypeScript**: Use strong typing for all Azure Storage entities and service methods
5. **Security**: Store sensitive configuration in environment variables or Azure Key Vault

## Azure Storage Schema

RSVPs are stored with:
- `partitionKey`: 'rsvp'
- `rowKey`: timestamp string
- `name`, `attending`, `guestCount`, `stayingForFood`, `submittedAt`

## When making changes:

- Update both environment files for dev/prod configurations
- Test Azure Storage operations with proper error handling
- Maintain responsive design principles
- Follow Angular standalone component patterns
- Use Azure SDK best practices for connection management and retry logic
