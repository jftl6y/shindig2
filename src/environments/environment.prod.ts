export const environment = {
  production: true,
  azureStorage: {
    // In production, these should be set as environment variables in your hosting platform
    accountName: (globalThis as any)?.process?.env?.['AZURE_STORAGE_ACCOUNT_NAME'] || 'YOUR_STORAGE_ACCOUNT_NAME',
    accountKey: (globalThis as any)?.process?.env?.['AZURE_STORAGE_ACCOUNT_KEY'] || 'YOUR_STORAGE_ACCOUNT_KEY',
    tableName: (globalThis as any)?.process?.env?.['AZURE_STORAGE_TABLE_NAME'] || 'rsvpresponses'
  }
};
