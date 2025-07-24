// Shindig 2 RSVP App - Azure Infrastructure
// Creates App Service Plan and App Service for hosting the Angular application

@description('Location for all resources')
param location string = resourceGroup().location

@description('Name of the App Service app')
param appName string = 'app-shindig-rsvp'

@description('Name of the App Service plan')
param appServicePlanName string = 'plan-shindig-rsvp'

@description('The SKU of App Service Plan')
param sku string = 'B1'

@description('Environment name (dev, staging, prod)')
param environmentName string = 'dev'

@description('Resource token for unique naming')
param resourceToken string = uniqueString(subscription().subscriptionId, resourceGroup().id)

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: '${appServicePlanName}-${resourceToken}'
  location: location
  properties: {
    reserved: false // Windows hosting
  }
  sku: {
    name: sku
    tier: 'Basic'
    size: sku
    family: 'B'
    capacity: 1
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// App Service
resource webApp 'Microsoft.Web/sites@2024-04-01' = {
  name: '${appName}-${resourceToken}'
  location: location
  kind: 'app'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    clientAffinityEnabled: false
    siteConfig: {
      alwaysOn: true
      ftpsState: 'FtpsOnly'
      minTlsVersion: '1.2'
      http20Enabled: true
      nodeVersion: '~18'
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~18'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
    }
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// Outputs
output webAppName string = webApp.name
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output resourceGroupName string = resourceGroup().name
