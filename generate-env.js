const fs = require('fs');
const path = require('path');

// Read environment variables
const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'YOUR_STORAGE_ACCOUNT_NAME';
const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN || 'YOUR_SAS_TOKEN';
const tableName = process.env.AZURE_STORAGE_TABLE_NAME || 'rsvpresponses';
const commentTableName = process.env.AZURE_STORAGE_COMMENT_TABLE_NAME || 'comments';

// Generate the environment file content
const environmentContent = `// This file is auto-generated during build
export const environment = {
  production: true,
  azure: {
    storageAccountName: '${storageAccountName}',
    sasToken: '${sasToken}',
    tableName: '${tableName}',
    commentTableName: '${commentTableName}'
  }
};`;

// Write the file
const outputPath = path.join(__dirname, 'src', 'environments', 'environment.generated.ts');
fs.writeFileSync(outputPath, environmentContent);

console.log('Environment file generated with values:');
console.log(`- Storage Account: ${storageAccountName}`);
console.log(`- Table Name: ${tableName}`);
console.log(`- Comment Table Name: ${commentTableName}`);
console.log(`- SAS Token: ${sasToken ? '[PROVIDED]' : '[NOT PROVIDED]'}`);
