export const environment = {
  production: true,
  azure: {
    storageAccountName: process.env['AZURE_STORAGE_ACCOUNT_NAME'] || 'YOUR_STORAGE_ACCOUNT_NAME',
    sasToken: process.env['AZURE_STORAGE_SAS_TOKEN'] || 'YOUR_SAS_TOKEN',
    tableName: process.env['AZURE_STORAGE_TABLE_NAME'] || 'rsvps',
    commentTableName: process.env['AZURE_STORAGE_COMMENT_TABLE_NAME'] || 'comments'
  }
};
