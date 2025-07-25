export const environment = {
  production: true,
  azure: {
    storageAccountName: process.env['AZURE_STORAGE_ACCOUNT_NAME'] || 'MissingEnv',
    sasToken: process.env['AZURE_STORAGE_SAS_TOKEN'] || 'MissingEnv',
    tableName: process.env['AZURE_STORAGE_TABLE_NAME'] || 'MissingEnv',
    commentTableName: process.env['AZURE_STORAGE_COMMENT_TABLE_NAME'] || 'MissingEnv'
  }
};
