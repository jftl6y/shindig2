import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommentService } from '../services/comment.service';
import { Comment, CommentResponse } from '../models/comment.model';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <!-- Header -->
      <div class="card">
        <div class="header-content">
          <h1 class="page-header">💬 Party Comments</h1>
          <a routerLink="/" class="btn btn-secondary">← Back to RSVP</a>
        </div>
        <p style="color: #666; margin-top: 10px;">
          Share your excitement, ask questions, or just say hello to other guests!
        </p>
      </div>

      <!-- Add Comment Form -->
      <div class="card">
        <h2 style="color: #667eea; margin-bottom: 20px;">Leave a Comment</h2>
        
        <form (ngSubmit)="submitComment()" #commentForm="ngForm">
          <div class="form-group">
            <label for="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              class="form-control"
              [(ngModel)]="newComment.name"
              required
              placeholder="Enter your name"
            />
          </div>

          <div class="form-group">
            <label for="message">Your Message *</label>
            <textarea
              id="message"
              name="message"
              class="form-control"
              [(ngModel)]="newComment.message"
              required
              placeholder="Share your thoughts about the party..."
              rows="4"
            ></textarea>
          </div>

          <div class="form-group" style="text-align: center; margin-top: 20px;">
            <button
              type="submit"
              class="btn"
              [disabled]="!commentForm.form.valid || isSubmitting"
            >
              <span *ngIf="isSubmitting" class="loading">
                <span class="spinner"></span>
                Posting...
              </span>
              <span *ngIf="!isSubmitting">
                Post Comment 💬
              </span>
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Comments List -->
      <div class="card">
        <div class="comments-header">
          <h2 style="color: #667eea;">All Comments</h2>
          <button (click)="loadComments()" class="btn btn-secondary" [disabled]="isLoading">
            <span *ngIf="isLoading">🔄</span>
            <span *ngIf="!isLoading">🔄 Refresh</span>
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading comments...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="loadErrorMessage" class="error-message">
          {{ loadErrorMessage }}
          <button (click)="loadComments()" class="btn btn-secondary" style="margin-top: 15px;">
            Try Again
          </button>
        </div>

        <!-- No Comments State -->
        <div *ngIf="!isLoading && !loadErrorMessage && comments.length === 0" class="no-comments">
          <p>No comments yet. Be the first to share your thoughts! 💭</p>
        </div>

        <!-- Comments -->
        <div *ngIf="!isLoading && !loadErrorMessage && comments.length > 0" class="comments-list">
          <div *ngFor="let comment of comments" class="comment-thread">
            <!-- Main Comment -->
            <div class="comment">
              <div class="comment-header">
                <strong class="comment-author">{{ comment.name }}</strong>
                <span class="comment-date">{{ formatDate(comment.submittedAt) }}</span>
              </div>
              <div class="comment-message">{{ comment.message }}</div>
              <div class="comment-actions">
                <button 
                  (click)="startReply(comment)" 
                  class="reply-btn"
                  [class.active]="replyingTo?.rowKey === comment.rowKey"
                >
                  💬 Reply
                </button>
              </div>
            </div>

            <!-- Reply Form -->
            <div *ngIf="replyingTo?.rowKey === comment.rowKey" class="reply-form">
              <form (ngSubmit)="submitReply(comment)" #replyForm="ngForm">
                <div class="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="replyName"
                    class="form-control"
                    [(ngModel)]="replyData.name"
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div class="form-group">
                  <label>Your Reply *</label>
                  <textarea
                    name="replyMessage"
                    class="form-control"
                    [(ngModel)]="replyData.message"
                    required
                    placeholder="Write your reply..."
                    rows="3"
                  ></textarea>
                </div>
                <div class="reply-actions">
                  <button
                    type="submit"
                    class="btn btn-small"
                    [disabled]="!replyForm.form.valid || isSubmittingReply"
                  >
                    <span *ngIf="isSubmittingReply">Posting...</span>
                    <span *ngIf="!isSubmittingReply">Post Reply</span>
                  </button>
                  <button type="button" (click)="cancelReply()" class="btn btn-secondary btn-small">
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Replies -->
            <div *ngIf="comment.replies && comment.replies.length > 0" class="replies">
              <div *ngFor="let reply of comment.replies" class="reply">
                <div class="comment-header">
                  <strong class="comment-author">{{ reply.name }}</strong>
                  <span class="comment-date">{{ formatDate(reply.submittedAt) }}</span>
                  <span class="reply-indicator">↳ Reply</span>
                </div>
                <div class="comment-message">{{ reply.message }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="card navigation-card">
        <div class="nav-links">
          <a routerLink="/" class="nav-link">🎉 RSVP Form</a>
          <a routerLink="/rsvps" class="nav-link">📋 View RSVPs</a>
          <a routerLink="/comments" class="nav-link active">💬 Comments</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .page-header {
      color: #667eea;
      margin: 0;
      font-size: 2rem;
    }

    .comments-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .comments-header h2 {
      margin: 0;
    }

    .loading-container {
      text-align: center;
      padding: 40px;
    }

    .spinner {
      width: 30px;
      height: 30px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .no-comments {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .comments-list {
      margin-top: 20px;
    }

    .comment-thread {
      margin-bottom: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }

    .comment-thread:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .comment {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 10px;
    }

    .comment-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .comment-author {
      color: #667eea;
      font-size: 1rem;
    }

    .comment-date {
      color: #888;
      font-size: 0.85rem;
    }

    .reply-indicator {
      color: #667eea;
      font-size: 0.85rem;
      font-weight: bold;
    }

    .comment-message {
      color: #333;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .comment-actions {
      margin-top: 10px;
    }

    .reply-btn {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 5px 10px;
      border-radius: 5px;
      transition: background-color 0.2s;
    }

    .reply-btn:hover {
      background-color: rgba(102, 126, 234, 0.1);
    }

    .reply-btn.active {
      background-color: #667eea;
      color: white;
    }

    .reply-form {
      background: #f0f2f5;
      border-radius: 10px;
      padding: 15px;
      margin: 10px 0 15px 0;
      border-left: 3px solid #667eea;
    }

    .reply-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .btn-small {
      padding: 8px 16px;
      font-size: 0.9rem;
    }

    .replies {
      margin-left: 20px;
      margin-top: 15px;
    }

    .reply {
      background: #e8f0fe;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 10px;
      border-left: 3px solid #667eea;
    }

    .navigation-card {
      background: rgba(255,255,255,0.9);
      text-align: center;
    }

    .nav-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .nav-link {
      color: #667eea;
      text-decoration: none;
      padding: 10px 15px;
      border-radius: 5px;
      transition: background-color 0.2s;
    }

    .nav-link:hover {
      background-color: rgba(102, 126, 234, 0.1);
    }

    .nav-link.active {
      background-color: #667eea;
      color: white;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .page-header {
        font-size: 1.5rem;
      }

      .comments-header {
        flex-direction: column;
        text-align: center;
      }

      .replies {
        margin-left: 10px;
      }

      .reply-actions {
        flex-direction: column;
        gap: 8px;
      }

      .nav-links {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class CommentsComponent implements OnInit {
  comments: CommentResponse[] = [];
  isLoading = true;
  errorMessage = '';
  loadErrorMessage = '';
  successMessage = '';

  // New comment form
  newComment = {
    name: '',
    message: ''
  };
  isSubmitting = false;

  // Reply functionality
  replyingTo: CommentResponse | null = null;
  replyData = {
    name: '',
    message: ''
  };
  isSubmittingReply = false;

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.loadComments();
  }

  async loadComments() {
    this.isLoading = true;
    this.loadErrorMessage = '';

    try {
      this.comments = await this.commentService.getAllComments();
    } catch (error) {
      console.error('Error loading comments:', error);
      this.loadErrorMessage = 'Failed to load comments. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async submitComment() {
    if (!this.newComment.name.trim() || !this.newComment.message.trim()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const commentData: Comment = {
        partitionKey: 'comment',
        rowKey: Date.now().toString(),
        name: this.newComment.name.trim(),
        message: this.newComment.message.trim(),
        submittedAt: new Date(),
        isReply: false
      };

      await this.commentService.submitComment(commentData);
      
      this.successMessage = `Thanks ${this.newComment.name}! Your comment has been posted. 💬`;
      
      // Reset form
      this.newComment = {
        name: '',
        message: ''
      };
      
      // Reload comments to show the new one
      setTimeout(() => {
        this.loadComments();
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      this.errorMessage = 'Sorry, there was an error posting your comment. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  startReply(comment: CommentResponse) {
    this.replyingTo = comment;
    this.replyData = {
      name: '',
      message: ''
    };
    // Clear any success messages
    this.successMessage = '';
  }

  cancelReply() {
    this.replyingTo = null;
    this.replyData = {
      name: '',
      message: ''
    };
  }

  async submitReply(parentComment: CommentResponse) {
    if (!this.replyData.name.trim() || !this.replyData.message.trim()) {
      return;
    }

    this.isSubmittingReply = true;

    try {
      const replyData: Comment = {
        partitionKey: 'comment',
        rowKey: Date.now().toString(),
        name: this.replyData.name.trim(),
        message: this.replyData.message.trim(),
        submittedAt: new Date(),
        parentCommentId: parentComment.rowKey,
        isReply: true
      };

      await this.commentService.submitComment(replyData);
      
      this.successMessage = `Thanks ${this.replyData.name}! Your reply has been posted. 💬`;
      
      // Reset reply form
      this.cancelReply();
      
      // Reload comments to show the new reply
      setTimeout(() => {
        this.loadComments();
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting reply:', error);
      this.errorMessage = 'Sorry, there was an error posting your reply. Please try again.';
    } finally {
      this.isSubmittingReply = false;
    }
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
