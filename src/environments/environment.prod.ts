export const environment = {
  production: true,
  azure: {
    storageAccountName: (globalThis as any)?.process?.env?.['AZURE_STORAGE_ACCOUNT_NAME'] || 'MissingEnv',
    sasToken: (globalThis as any)?.process?.env?.['AZURE_STORAGE_SAS_TOKEN'] || 'MissingEnv',
    tableName: (globalThis as any)?.process?.env?.['AZURE_STORAGE_TABLE_NAME'] || 'MissingEnv',
    commentTableName: (globalThis as any)?.process?.env?.['AZURE_STORAGE_COMMENT_TABLE_NAME'] || 'MissingEnv'
  }
};
