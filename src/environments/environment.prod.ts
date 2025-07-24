export const environment = {
  production: true,
  azure: {
    storageAccountName: (globalThis as any)?.process?.env?.['AZURE_STORAGE_ACCOUNT_NAME'] || 'stparty54329',
    sasToken: (globalThis as any)?.process?.env?.['AZURE_STORAGE_SAS_TOKEN'] || 'sv=2022-11-02&ss=t&srt=sco&sp=rwdlacupi&se=2025-01-26T03:40:29Z&st=2025-01-25T19:40:29Z&spr=https&sig=SHdKxUV4CjzNB6P2jLnfUZ7wCWgagJ1mC6pbYpP0F8Q%3D',
    tableName: (globalThis as any)?.process?.env?.['AZURE_STORAGE_TABLE_NAME'] || 'rsvp',
    commentTableName: (globalThis as any)?.process?.env?.['AZURE_STORAGE_COMMENT_TABLE_NAME'] || 'comments'
  }
};
