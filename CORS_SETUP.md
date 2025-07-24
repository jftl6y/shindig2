# Configure CORS for Azure Storage Tables

To resolve CORS issues when accessing Azure Storage Tables from the browser, run this command:

```bash
az storage cors add \
  --account-name joscotshindig \
  --services t \
  --methods GET POST PUT DELETE OPTIONS \
  --origins "http://localhost:4200" "https://localhost:4200" "*" \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 3600
```

## Alternative: Using Azure Portal

1. Go to Azure Portal → Your Storage Account
2. Navigate to **Settings** → **Resource sharing (CORS)**  
3. Select **Table service** tab
4. Add a new CORS rule:
   - **Allowed origins**: `*` (or `http://localhost:4200` for development)
   - **Allowed methods**: `GET,POST,PUT,DELETE,OPTIONS`
   - **Allowed headers**: `*`
   - **Exposed headers**: `*`
   - **Max age**: `3600`

5. Click **Save**

This will allow your browser-based Angular application to successfully communicate with Azure Storage Tables.
