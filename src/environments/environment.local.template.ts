// This is a template for local environment configuration
// Copy this file to environment.local.ts and update with your Azure Storage credentials
export const environment = {
  production: false,
  azureStorage: {
    accountName: 'your_actual_storage_account_name',
    accountKey: 'your_actual_storage_account_key',
    tableName: 'rsvpresponses'
  }
};
