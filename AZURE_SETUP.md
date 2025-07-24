# Azure Storage Configuration

## Imp### 4. Generate SAS Token

The application uses SAS (Shared Access Signature) tokens for browser-compatible authentication:

```bash
# Generate SAS token for the storage account with permissions for both tables
az storage account generate-sas 
  --account-name joscotshindig 
  --services t 
  --resource-types sco 
  --permissions rwdlac 
  --expiry 2025-12-31T23:59:59Z
```

**Important**: This token provides access to both the `rsvpresponses` and `comments` tables. Store the generated token securely and update your environment variables.r Authentication

**For browser-based applications, you must use SAS (Shared Access Signature) tokens instead of account keys.**
Account keys are not supported in browsers for security reasons.

## Setup Instructions

### 1. Create Azure Storage Account

```bash
# Create resource group
az group create --name rg-shindig-rsvp --location eastus

# Create storage account
az storage account create \
  --name joscotshindig \
  --resource-group rg-shindig-rsvp \
  --location eastus \
  --sku Standard_LRS
```

### 2. Create Tables

```bash
# Create RSVP responses table
az storage table create \
  --name rsvpresponses \
  --account-name joscotshindig

# Create comments table  
az storage table create \
  --name comments \
  --account-name joscotshindig
```

### 3. Generate SAS Token (Required for Browser Access)

```bash
# Generate SAS token for table access (valid for 1 year)
az storage table generate-sas \
  --account-name joscotshindig \
  --name rsvpresponses \
  --permissions rwdlacu \
  --expiry 2025-09-01T07:24:54Z \
  --start 2025-07-23T23:09:54Z \
  --protocol https
```

**Copy the generated SAS token and use it as the `accountKey` in your environment configuration.**

### 5. Configure CORS

Enable CORS for both services - Blob and Table:

```bash
# Enable CORS for Blob service (if needed for file uploads)
az storage cors add 
  --services b 
  --methods GET POST PUT OPTIONS 
  --origins "*" 
  --allowed-headers "*" 
  --exposed-headers "*" 
  --max-age 3600 
  --account-name joscotshindig

# Enable CORS for Table service (required for RSVP and comment operations)
az storage cors add 
  --services t 
  --methods GET POST PUT DELETE OPTIONS 
  --origins "*" 
  --allowed-headers "*" 
  --exposed-headers "*" 
  --max-age 3600 
  --account-name joscotshindig
```

**Note**: The Table service CORS configuration is essential for both RSVP responses and comments functionality to work from the browser.

### 5. Environment Variables

For local development, update your `environment.ts`:

```typescript
export const environment = {
  production: false,
  azureStorage: {
    accountName: 'joscotshindig',
    accountKey: 'your_sas_token_here', // SAS token, not account key
    tableName: 'rsvpresponses'
  }
};
```

For production deployment, set these environment variables:

```bash
AZURE_STORAGE_ACCOUNT_NAME=joscotshindig
AZURE_STORAGE_ACCOUNT_KEY=your_sas_token_here  # SAS token
AZURE_STORAGE_TABLE_NAME=rsvpresponses
```

### 5. Managed Identity (Recommended for Production)

Instead of using account keys, configure Managed Identity:

1. Enable system-assigned managed identity on your App Service
2. Grant "Storage Table Data Contributor" role to the managed identity
3. Update the service to use `DefaultAzureCredential` instead of `AzureNamedKeyCredential`

## Security Best Practices

1. **Never commit storage keys to version control**
2. **Use Azure Key Vault for production secrets**
3. **Enable Azure Storage firewall for production**
4. **Use Managed Identity instead of storage keys**
5. **Configure proper CORS settings for your domain**

## Monitoring

Consider adding Application Insights for monitoring:

```bash
az monitor app-insights component create \
  --app shindig-rsvp-insights \
  --location eastus \
  --resource-group rg-shindig-rsvp
```
