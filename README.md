# Shindig RSVP Application

A modern Angular application for party RSVPs that stores responses in Azure Storage Table.

## Features

- 📝 **RSVP Form**: Guests can enter their name, attendance status, guest count, and food preferences
- 🎉 **Party Details**: Displays event information including date, time, location, and dinner details
- 👕 **Shirt Orders**: Link to order commemorative shirts
- ☁️ **Azure Integration**: Stores RSVP responses in Azure Storage Table
- 📱 **Responsive Design**: Mobile-friendly interface
- ✨ **Modern UI**: Beautiful gradient design with smooth animations

## Technology Stack

- **Frontend**: Angular 18 with standalone components
- **Styling**: CSS with modern gradients and responsive design
- **Backend**: Azure Storage Table for data persistence
- **Authentication**: Azure Storage Account Key (configurable for Managed Identity)

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- Angular CLI
- Azure Storage Account

### 1. Clone and Install

```bash
git clone <repository-url>
cd shindig-rsvp
npm install
```

### 2. Azure Storage Configuration

1. Create an Azure Storage Account
2. Create a table named `rsvpresponses`
3. Get your storage account name and key
4. Update the configuration in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  azureStorage: {
    accountName: 'YOUR_STORAGE_ACCOUNT_NAME',
    accountKey: 'YOUR_STORAGE_ACCOUNT_KEY',
    tableName: 'rsvpresponses'
  }
};
```

### 3. Production Configuration

For production, update `src/environments/environment.prod.ts` with your production Azure Storage credentials.

**Security Note**: In production, consider using Azure Managed Identity instead of storage account keys for better security.

### 4. Run the Application

```bash
# Development server
npm start

# Build for production
npm run build
```

The application will be available at `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── services/
│   │   └── rsvp.service.ts          # Azure Storage Table integration
│   ├── app.component.ts             # Main RSVP component
│   ├── app.config.ts               # Application configuration
│   └── app.routes.ts               # Routing configuration
├── environments/
│   ├── environment.ts              # Development environment
│   └── environment.prod.ts         # Production environment
├── styles.css                      # Global styles
└── index.html                      # Main HTML file
```

## RSVP Data Structure

The application stores the following data in Azure Storage Table:

- **partitionKey**: 'rsvp' (groups all RSVPs)
- **rowKey**: Timestamp (unique identifier)
- **name**: Guest name
- **attending**: Boolean (true/false)
- **guestCount**: Number of people attending
- **stayingForFood**: Boolean (food preference)
- **submittedAt**: Submission timestamp

## Customization

### Party Details

Update the party information in `app.component.ts`:

- Date and time
- Location address
- Dinner details
- Shirt order link

### Styling

Modify `src/styles.css` to change colors, fonts, and layout.

### Azure Storage

The `RsvpService` provides methods for:

- `submitRsvp()`: Store new RSVP
- `getAllRsvps()`: Retrieve all responses
- `getRsvpByName()`: Find specific RSVP
- `deleteRsvp()`: Remove RSVP

## Security Considerations

1. **Azure Storage Keys**: Store in environment variables or Azure Key Vault
2. **CORS**: Configure Azure Storage CORS for your domain
3. **Managed Identity**: Use for production deployments
4. **HTTPS**: Always use HTTPS in production

## Deployment

### Azure Static Web Apps

1. Build the application: `npm run build`
2. Deploy the `dist/shindig-rsvp` folder to Azure Static Web Apps
3. Configure environment variables in Azure

### Azure App Service

1. Create an Azure App Service
2. Deploy using Azure DevOps or GitHub Actions
3. Set environment variables in App Service configuration

## Troubleshooting

### Common Issues

1. **CORS Errors**: Configure Azure Storage CORS settings
2. **Authentication Errors**: Verify storage account name and key
3. **Table Not Found**: Ensure the table exists or the service will create it

### Error Messages

The application provides user-friendly error messages for:

- Network connectivity issues
- Authentication failures
- Validation errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, contact: party@shindig.com

---

Built with ❤️ for amazing parties! 🎉
