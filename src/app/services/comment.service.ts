import { Injectable } from '@angular/core';
import { TableClient, AzureNamedKeyCredential, AzureSASCredential } from '@azure/data-tables';
import { environment } from '../../environments/environment';
import { Comment, CommentResponse } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private tableClient?: TableClient;

  constructor() {
    // Azure Storage configuration from environment
    const config = environment.azure;
    
    console.log('Comments Service - Azure Storage Config:', {
      accountName: config.storageAccountName,
      tableName: config.commentTableName,
      hasSasToken: config.sasToken && config.sasToken.length > 0,
      authType: 'SAS Token'
    });
    
    // Check if we have valid configuration
    if (!config.storageAccountName || !config.sasToken) {
      console.warn('Azure Storage not configured. Using mock service for development.');
      return;
    }
    
    // Use SAS token authentication (browser-compatible)
    const sasCredential = new AzureSASCredential(config.sasToken);
    this.tableClient = new TableClient(
      `https://${config.storageAccountName}.table.core.windows.net`,
      config.commentTableName,
      sasCredential
    );
    console.log('Comments Table Client initialized with SAS token for:', `https://${config.storageAccountName}.table.core.windows.net/${config.commentTableName}`);

    // Initialize table if it doesn't exist
    this.initializeTable();
  }

  private async initializeTable(): Promise<void> {
    if (!this.tableClient) {
      console.warn('Comments table client not initialized - running in development mode');
      return;
    }
    
    try {
      await this.tableClient.createTable();
      console.log('Comments table created or already exists');
    } catch (error: any) {
      // Table already exists
      if (error.statusCode !== 409) {
        console.error('Error creating comments table:', error);
      }
    }
  }

  async submitComment(commentData: Comment): Promise<void> {
    if (!this.tableClient) {
      console.log('Mock comment submission:', commentData);
      return;
    }
    
    try {
      // Create entity for Azure Table Storage
      const entity = {
        partitionKey: commentData.partitionKey,
        rowKey: commentData.rowKey,
        name: commentData.name,
        message: commentData.message,
        submittedAt: commentData.submittedAt.toISOString(),
        parentCommentId: commentData.parentCommentId || '',
        isReply: commentData.isReply,
        timestamp: new Date()
      };

      await this.tableClient.createEntity(entity);
      console.log('Comment submitted successfully:', entity);
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      
      // Handle specific Azure Storage errors
      if (error.statusCode === 409) {
        throw new Error('Comment already exists. Please try again.');
      } else if (error.statusCode === 403) {
        throw new Error('Access denied. Please check your connection and try again.');
      } else {
        throw new Error('Failed to submit comment. Please try again later.');
      }
    }
  }

  async getAllComments(): Promise<CommentResponse[]> {
    if (!this.tableClient) {
      console.log('Mock getAllComments - returning sample comments');
      return [
        {
          partitionKey: 'comment',
          rowKey: '1',
          name: 'Sample User',
          message: 'This is a sample comment!',
          submittedAt: new Date(),
          isReply: false,
          replies: []
        }
      ];
    }
    
    try {
      const entities = this.tableClient.listEntities<any>();
      const comments: Comment[] = [];

      for await (const entity of entities) {
        comments.push({
          partitionKey: entity.partitionKey,
          rowKey: entity.rowKey,
          name: entity.name,
          message: entity.message,
          submittedAt: new Date(entity.submittedAt),
          parentCommentId: entity.parentCommentId || undefined,
          isReply: entity.isReply || false
        });
      }

      // Organize comments with replies
      return this.organizeCommentsWithReplies(comments);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments. Please try again later.');
    }
  }

  private organizeCommentsWithReplies(comments: Comment[]): CommentResponse[] {
    const commentsMap = new Map<string, CommentResponse>();
    const rootComments: CommentResponse[] = [];

    // First pass: create all comment objects
    comments.forEach(comment => {
      const commentResponse: CommentResponse = {
        ...comment,
        replies: []
      };
      commentsMap.set(comment.rowKey, commentResponse);
      
      if (!comment.isReply) {
        rootComments.push(commentResponse);
      }
    });

    // Second pass: organize replies under parent comments
    comments.forEach(comment => {
      if (comment.isReply && comment.parentCommentId) {
        const parentComment = commentsMap.get(comment.parentCommentId);
        const replyComment = commentsMap.get(comment.rowKey);
        
        if (parentComment && replyComment) {
          parentComment.replies = parentComment.replies || [];
          parentComment.replies.push(replyComment);
        }
      }
    });

    // Sort comments by date (newest first)
    rootComments.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    
    // Sort replies by date (oldest first for better conversation flow)
    rootComments.forEach(comment => {
      if (comment.replies) {
        comment.replies.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
      }
    });

    return rootComments;
  }

  async deleteComment(rowKey: string): Promise<void> {
    if (!this.tableClient) {
      console.log('Mock delete comment:', rowKey);
      return;
    }

    try {
      await this.tableClient.deleteEntity('comment', rowKey);
      console.log('Comment deleted successfully:', rowKey);
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      throw new Error('Failed to delete comment. Please try again later.');
    }
  }
}
