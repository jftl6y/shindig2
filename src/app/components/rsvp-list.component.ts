import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RsvpService, RsvpResponse } from '../services/rsvp.service';

@Component({
  selector: 'app-rsvp-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <!-- Header -->
      <div class="card">
        <div class="header-content">
          <h1 class="page-header">📋 RSVP Responses</h1>
          <div class="nav-buttons">
            <a routerLink="/" class="btn btn-secondary">🎉 RSVP Form</a>
            <a routerLink="/comments" class="btn btn-secondary">💬 Comments</a>
          </div>
        </div>
        
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-number">{{ totalResponses }}</div>
            <div class="stat-label">Total Responses</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ attendingCount }}</div>
            <div class="stat-label">Attending</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ notAttendingCount }}</div>
            <div class="stat-label">Not Attending</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ totalGuests }}</div>
            <div class="stat-label">Total Guests</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ foodCount }}</div>
            <div class="stat-label">Staying for Food</div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="card">
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading RSVP responses...</p>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="errorMessage" class="card">
        <div class="error-message">
          {{ errorMessage }}
          <button (click)="loadRsvps()" class="btn btn-secondary" style="margin-top: 15px;">
            Try Again
          </button>
        </div>
      </div>

      <!-- RSVP List -->
      <div *ngIf="!isLoading && !errorMessage" class="card">
        <h2 style="color: #667eea; margin-bottom: 25px;">All Responses</h2>
        
        <div *ngIf="rsvps.length === 0" class="no-responses">
          <p>No RSVP responses yet. Be the first to respond!</p>
          <a routerLink="/" class="btn">Submit Your RSVP</a>
        </div>
        
        <div *ngIf="rsvps.length > 0" class="rsvp-table-container">
          <table class="rsvp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Attending</th>
                <th>Guests</th>
                <th>Food</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let rsvp of rsvps" [class.attending]="rsvp.attending" [class.not-attending]="!rsvp.attending">
                <td class="name-cell">
                  <strong>{{ rsvp.name }}</strong>
                </td>
                <td class="status-cell">
                  <span [class]="'status-badge ' + (rsvp.attending ? 'attending' : 'not-attending')">
                    {{ rsvp.attending ? '✅ Yes' : '❌ No' }}
                  </span>
                </td>
                <td class="guests-cell">
                  <span *ngIf="rsvp.attending">{{ rsvp.guestCount }} {{ rsvp.guestCount === 1 ? 'person' : 'people' }}</span>
                  <span *ngIf="!rsvp.attending" class="na">N/A</span>
                </td>
                <td class="food-cell">
                  <span *ngIf="rsvp.attending">
                    {{ rsvp.stayingForFood ? '🍽️ Yes' : '➖ No' }}
                  </span>
                  <span *ngIf="!rsvp.attending" class="na">N/A</span>
                </td>
                <td class="date-cell">
                  {{ formatDate(rsvp.submittedAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div class="card" style="text-align: center; background: rgba(255,255,255,0.9);">
        <p style="color: #667eea; margin-bottom: 10px;">
          <strong>Party Planning Dashboard</strong>
        </p>
        <p style="color: #888; font-size: 14px;">
          Real-time RSVP tracking for Shindig 2! 🎊
        </p>
      </div>
    </div>
  `,
  styles: [`
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .page-header {
      color: #667eea;
      margin: 0;
      font-size: 2rem;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .loading-container {
      text-align: center;
      padding: 40px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .no-responses {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .rsvp-table-container {
      overflow-x: auto;
    }

    .rsvp-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .rsvp-table th,
    .rsvp-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .rsvp-table th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: bold;
      position: sticky;
      top: 0;
    }

    .rsvp-table tr:hover {
      background-color: rgba(102, 126, 234, 0.05);
    }

    .rsvp-table tr.attending {
      background-color: rgba(76, 175, 80, 0.05);
    }

    .rsvp-table tr.not-attending {
      background-color: rgba(244, 67, 54, 0.05);
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 15px;
      font-size: 0.85rem;
      font-weight: bold;
    }

    .status-badge.attending {
      background-color: #4caf50;
      color: white;
    }

    .status-badge.not-attending {
      background-color: #f44336;
      color: white;
    }

    .na {
      color: #999;
      font-style: italic;
    }

    .name-cell {
      min-width: 150px;
    }

    .date-cell {
      min-width: 120px;
      font-size: 0.9rem;
      color: #666;
    }

    .nav-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .page-header {
        font-size: 1.5rem;
      }

      .nav-buttons {
        justify-content: center;
      }

      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }

      .stat-number {
        font-size: 1.5rem;
      }

      .rsvp-table {
        font-size: 0.9rem;
      }

      .rsvp-table th,
      .rsvp-table td {
        padding: 8px 4px;
      }
    }
  `]
})
export class RsvpListComponent implements OnInit {
  rsvps: RsvpResponse[] = [];
  isLoading = true;
  errorMessage = '';

  // Statistics
  totalResponses = 0;
  attendingCount = 0;
  notAttendingCount = 0;
  totalGuests = 0;
  foodCount = 0;

  constructor(private rsvpService: RsvpService) {}

  ngOnInit() {
    this.loadRsvps();
  }

  async loadRsvps() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      this.rsvps = await this.rsvpService.getAllRsvps();
      this.calculateStatistics();
    } catch (error) {
      console.error('Error loading RSVPs:', error);
      this.errorMessage = 'Failed to load RSVP responses. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private calculateStatistics() {
    this.totalResponses = this.rsvps.length;
    this.attendingCount = this.rsvps.filter(r => r.attending).length;
    this.notAttendingCount = this.rsvps.filter(r => !r.attending).length;
    this.totalGuests = this.rsvps
      .filter(r => r.attending)
      .reduce((sum, r) => sum + r.guestCount, 0);
    this.foodCount = this.rsvps.filter(r => r.attending && r.stayingForFood).length;
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
