import { Injectable } from '@angular/core';
import { TableClient, AzureNamedKeyCredential, AzureSASCredential } from '@azure/data-tables';
import { environment } from '../../environments/environment';

export interface RsvpResponse {
  partitionKey: string;
  rowKey: string;
  name: string;
  attending: boolean;
  guestCount: number;
  stayingForFood: boolean;
  submittedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RsvpService {
  private tableClient?: TableClient;

  constructor() {
    // Azure Storage configuration from environment
    const config = environment.azureStorage;
    
    console.log('Azure Storage Config:', {
      accountName: config.accountName,
      tableName: config.tableName,
      hasAccountKey: config.accountKey !== 'YOUR_STORAGE_ACCOUNT_KEY' && config.accountKey.length > 0,
      authType: config.accountKey.startsWith('sv=') ? 'SAS Token' : 'Account Key'
    });
    
    // Check if we have valid configuration
    if (config.accountName === 'YOUR_STORAGE_ACCOUNT_NAME' || config.accountKey === 'YOUR_STORAGE_ACCOUNT_KEY') {
      console.warn('Azure Storage not configured. Using mock service for development.');
      // Don't initialize the table client for now
      return;
    }
    
    // Check if the accountKey is actually a SAS token (starts with 'sv=')
    if (config.accountKey.startsWith('sv=')) {
      // Use SAS token authentication (browser-compatible)
      const sasCredential = new AzureSASCredential(config.accountKey);
      this.tableClient = new TableClient(
        `https://${config.accountName}.table.core.windows.net`,
        config.tableName,
        sasCredential
      );
      console.log('Azure Table Client initialized with SAS token for:', `https://${config.accountName}.table.core.windows.net/${config.tableName}`);
    } else {
      // Use account key authentication (not supported in browser, but keep for server-side compatibility)
      console.warn('Account key authentication is not supported in browser. Please use SAS token instead.');
      const credential = new AzureNamedKeyCredential(config.accountName, config.accountKey);
      this.tableClient = new TableClient(
        `https://${config.accountName}.table.core.windows.net`,
        config.tableName,
        credential
      );
    }

    // Initialize table if it doesn't exist
    this.initializeTable();
  }

  private async initializeTable(): Promise<void> {
    if (!this.tableClient) {
      console.warn('Table client not initialized - running in development mode');
      return;
    }
    
    try {
      await this.tableClient.createTable();
      console.log('Table created or already exists');
    } catch (error: any) {
      // Table already exists
      if (error.statusCode !== 409) {
        console.error('Error creating table:', error);
      }
    }
  }

  async submitRsvp(rsvpData: RsvpResponse): Promise<void> {
    if (!this.tableClient) {
      console.log('Mock RSVP submission:', rsvpData);
      // In development mode without Azure Storage, just log the submission
      return;
    }
    
    try {
      // Create entity for Azure Table Storage
      const entity = {
        partitionKey: rsvpData.partitionKey,
        rowKey: rsvpData.rowKey,
        name: rsvpData.name,
        attending: rsvpData.attending,
        guestCount: rsvpData.guestCount,
        stayingForFood: rsvpData.stayingForFood,
        submittedAt: rsvpData.submittedAt.toISOString(),
        timestamp: new Date()
      };

      await this.tableClient.createEntity(entity);
      console.log('RSVP submitted successfully:', entity);
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      
      // Handle specific Azure Storage errors
      if (error.statusCode === 409) {
        throw new Error('RSVP already submitted. Please contact us if you need to make changes.');
      } else if (error.statusCode === 403) {
        throw new Error('Access denied. Please check your connection and try again.');
      } else {
        throw new Error('Failed to submit RSVP. Please try again later.');
      }
    }
  }

  async getAllRsvps(): Promise<RsvpResponse[]> {
    if (!this.tableClient) {
      console.log('Mock getAllRsvps - returning empty array');
      return [];
    }
    
    try {
      const entities = this.tableClient.listEntities<any>();
      const rsvps: RsvpResponse[] = [];

      for await (const entity of entities) {
        rsvps.push({
          partitionKey: entity.partitionKey,
          rowKey: entity.rowKey,
          name: entity.name,
          attending: entity.attending,
          guestCount: entity.guestCount,
          stayingForFood: entity.stayingForFood,
          submittedAt: new Date(entity.submittedAt)
        });
      }

      return rsvps;
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      throw new Error('Failed to fetch RSVPs');
    }
  }

  async getRsvpByName(name: string): Promise<RsvpResponse | null> {
    if (!this.tableClient) {
      console.log('Mock getRsvpByName - returning null');
      return null;
    }
    
    try {
      const entities = this.tableClient.listEntities<any>({
        queryOptions: { filter: `name eq '${name}'` }
      });

      for await (const entity of entities) {
        return {
          partitionKey: entity.partitionKey,
          rowKey: entity.rowKey,
          name: entity.name,
          attending: entity.attending,
          guestCount: entity.guestCount,
          stayingForFood: entity.stayingForFood,
          submittedAt: new Date(entity.submittedAt)
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching RSVP by name:', error);
      return null;
    }
  }

  async deleteRsvp(partitionKey: string, rowKey: string): Promise<void> {
    if (!this.tableClient) {
      console.log('Mock deleteRsvp');
      return;
    }
    
    try {
      await this.tableClient.deleteEntity(partitionKey, rowKey);
      console.log('RSVP deleted successfully');
    } catch (error) {
      console.error('Error deleting RSVP:', error);
      throw new Error('Failed to delete RSVP');
    }
  }

  async getRsvpStats(): Promise<{
    totalRsvps: number;
    attending: number;
    notAttending: number;
    totalGuests: number;
    stayingForFood: number;
  }> {
    try {
      const rsvps = await this.getAllRsvps();
      
      const stats = rsvps.reduce((acc, rsvp) => {
        acc.totalRsvps++;
        if (rsvp.attending) {
          acc.attending++;
          acc.totalGuests += rsvp.guestCount;
          if (rsvp.stayingForFood) {
            acc.stayingForFood += rsvp.guestCount;
          }
        } else {
          acc.notAttending++;
        }
        return acc;
      }, {
        totalRsvps: 0,
        attending: 0,
        notAttending: 0,
        totalGuests: 0,
        stayingForFood: 0
      });

      return stats;
    } catch (error: any) {
      console.error('Error calculating RSVP stats:', error);
      throw new Error('Failed to calculate statistics');
    }
  }
}
