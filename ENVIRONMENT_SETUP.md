# Environment Setup Guide

## Local Development Setup

1. **Configure local development credentials:**
   
   Update `src/environments/environment.ts` directly with your Azure Storage credentials.
   This file is gitignored to protect your credentials from being committed.

2. **Configure Azure Storage:**
   - Create an Azure Storage Account in the Azure Portal
   - Get your Account Name and Account Key from the Access Keys section
   - Update `src/environments/environment.ts`:

   ```typescript
   export const environment = {
     production: false,
     azureStorage: {
       accountName: 'your_actual_storage_account_name',
       accountKey: 'your_actual_storage_account_key',
       tableName: 'rsvpresponses'
     }
   };
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

## Production Deployment

For production, set these environment variables in your hosting platform:
- `AZURE_STORAGE_ACCOUNT_NAME`
- `AZURE_STORAGE_ACCOUNT_KEY` (or preferably use Managed Identity)
- `AZURE_STORAGE_TABLE_NAME`

## Security Notes

- ✅ `.env.local` is ignored by git to protect your credentials
- ✅ The application gracefully handles missing Azure Storage credentials in development
- ✅ In production, consider using Azure Managed Identity instead of storage keys
- ✅ All sensitive data should be stored in environment variables, never in code

## Testing Azure Storage

1. With valid credentials, the app will automatically create the table if it doesn't exist
2. RSVP submissions will be stored in Azure Storage Tables
3. You can view stored data in the Azure Portal under your Storage Account > Tables
