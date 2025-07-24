import { Injectable } from '@angular/core';
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';
import { DefaultAzureCredential } from '@azure/identity';
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
  private tableClient: TableClient;

  constructor() {
    const config = environment.azureStorage;
    
    // Initialize Azure Storage Table Client
    // Use Managed Identity in production, Account Key for development
    if (environment.production && !config.accountKey) {
      // Production: Use Managed Identity (recommended)
      const credential = new DefaultAzureCredential();
      this.tableClient = new TableClient(
        `https://${config.accountName}.table.core.windows.net`,
        config.tableName,
        credential
      );
    } else {
      // Development: Use Account Key
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
    try {
      await this.tableClient.createTable();
      console.log('Table created or already exists');
    } catch (error: any) {
      // Table already exists or other error
      if (error.statusCode !== 409) {
        console.error('Error creating table:', error);
      }
    }
  }

  async submitRsvp(rsvpData: RsvpResponse): Promise<void> {
    try {
      // Validate input data
      if (!rsvpData.name || rsvpData.name.trim().length === 0) {
        throw new Error('Name is required');
      }

      if (rsvpData.attending === null || rsvpData.attending === undefined) {
        throw new Error('Attendance status is required');
      }

      // Create entity for Azure Table Storage
      const entity = {
        partitionKey: rsvpData.partitionKey,
        rowKey: rsvpData.rowKey,
        name: rsvpData.name.trim(),
        attending: rsvpData.attending,
        guestCount: rsvpData.guestCount || 0,
        stayingForFood: rsvpData.stayingForFood || false,
        submittedAt: rsvpData.submittedAt.toISOString(),
        timestamp: new Date().toISOString(),
        // Additional metadata
        userAgent: navigator.userAgent,
        ipAddress: 'client-side' // Would need server-side for real IP
      };

      // Use upsert to allow updates of existing RSVPs
      await this.tableClient.upsertEntity(entity);
      console.log('RSVP submitted successfully:', entity);

    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
      
      // Handle specific Azure Storage errors
      if (error.statusCode === 403) {
        throw new Error('Access denied. Please check your connection and try again.');
      } else if (error.statusCode === 404) {
        throw new Error('Storage service not found. Please contact support.');
      } else if (error.statusCode === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      } else if (error.message?.includes('Name is required') || error.message?.includes('Attendance status')) {
        throw error; // Re-throw validation errors
      } else {
        throw new Error('Failed to submit RSVP. Please try again later.');
      }
    }
  }

  async getAllRsvps(): Promise<RsvpResponse[]> {
    try {
      const entities = this.tableClient.listEntities<any>({
        queryOptions: { 
          select: ['partitionKey', 'rowKey', 'name', 'attending', 'guestCount', 'stayingForFood', 'submittedAt']
        }
      });
      const rsvps: RsvpResponse[] = [];

      for await (const entity of entities) {
        rsvps.push({
          partitionKey: entity.partitionKey,
          rowKey: entity.rowKey,
          name: entity.name,
          attending: entity.attending,
          guestCount: entity.guestCount || 0,
          stayingForFood: entity.stayingForFood || false,
          submittedAt: new Date(entity.submittedAt)
        });
      }

      // Sort by submission date (newest first)
      return rsvps.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

    } catch (error: any) {
      console.error('Error fetching RSVPs:', error);
      throw new Error('Failed to fetch RSVPs');
    }
  }

  async getRsvpByName(name: string): Promise<RsvpResponse | null> {
    try {
      if (!name || name.trim().length === 0) {
        return null;
      }

      const entities = this.tableClient.listEntities<any>({
        queryOptions: { 
          filter: `name eq '${name.trim()}'`,
          select: ['partitionKey', 'rowKey', 'name', 'attending', 'guestCount', 'stayingForFood', 'submittedAt']
        }
      });

      for await (const entity of entities) {
        return {
          partitionKey: entity.partitionKey,
          rowKey: entity.rowKey,
          name: entity.name,
          attending: entity.attending,
          guestCount: entity.guestCount || 0,
          stayingForFood: entity.stayingForFood || false,
          submittedAt: new Date(entity.submittedAt)
        };
      }

      return null;
    } catch (error: any) {
      console.error('Error fetching RSVP by name:', error);
      return null;
    }
  }

  async updateRsvp(partitionKey: string, rowKey: string, updates: Partial<RsvpResponse>): Promise<void> {
    try {
      // Get existing entity first
      const existingEntity = await this.tableClient.getEntity(partitionKey, rowKey);
      
      // Merge updates with explicit partitionKey and rowKey
      const updatedEntity = {
        ...existingEntity,
        ...updates,
        partitionKey: partitionKey, // Ensure required properties are set
        rowKey: rowKey,
        timestamp: new Date().toISOString()
      };

      // Update the entity
      await this.tableClient.updateEntity(updatedEntity, 'Merge');
      console.log('RSVP updated successfully');

    } catch (error: any) {
      console.error('Error updating RSVP:', error);
      if (error.statusCode === 404) {
        throw new Error('RSVP not found');
      }
      throw new Error('Failed to update RSVP');
    }
  }

  async deleteRsvp(partitionKey: string, rowKey: string): Promise<void> {
    try {
      await this.tableClient.deleteEntity(partitionKey, rowKey);
      console.log('RSVP deleted successfully');
    } catch (error: any) {
      console.error('Error deleting RSVP:', error);
      if (error.statusCode === 404) {
        throw new Error('RSVP not found');
      }
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
