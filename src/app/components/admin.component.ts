import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RsvpService, RsvpResponse } from '../services/rsvp.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="card">
        <h1 style="color: #667eea; text-align: center; margin-bottom: 30px;">
          🎉 RSVP Admin Dashboard
        </h1>

        <!-- Statistics -->
        <div class="stats-grid" *ngIf="stats">
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalRsvps }}</div>
            <div class="stat-label">Total RSVPs</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.attending }}</div>
            <div class="stat-label">Attending</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.totalGuests }}</div>
            <div class="stat-label">Total Guests</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ stats.stayingForFood }}</div>
            <div class="stat-label">Staying for Food</div>
          </div>
        </div>

        <!-- RSVP List -->
        <div class="rsvp-list">
          <h2 style="color: #667eea; margin-bottom: 20px;">All RSVPs</h2>
          
          <div *ngIf="loading" class="loading">
            <span class="spinner"></span>
            Loading RSVPs...
          </div>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <div *ngIf="!loading && rsvps.length === 0" style="text-align: center; color: #666; padding: 40px;">
            No RSVPs submitted yet.
          </div>

          <div *ngFor="let rsvp of rsvps" class="rsvp-item">
            <div class="rsvp-header">
              <h3>{{ rsvp.name }}</h3>
              <span class="attendance-badge" [class.attending]="rsvp.attending" [class.not-attending]="!rsvp.attending">
                {{ rsvp.attending ? 'Attending' : 'Not Attending' }}
              </span>
            </div>
            <div class="rsvp-details">
              <div *ngIf="rsvp.attending">
                <strong>Guests:</strong> {{ rsvp.guestCount }} people
              </div>
              <div *ngIf="rsvp.attending">
                <strong>Food:</strong> {{ rsvp.stayingForFood ? 'Staying for dinner' : 'Not staying for dinner' }}
              </div>
              <div class="submission-date">
                <strong>Submitted:</strong> {{ rsvp.submittedAt | date:'medium' }}
              </div>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <button class="btn" (click)="refreshData()">
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 20px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }

    .stat-number {
      font-size: 2.5em;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.9em;
      opacity: 0.9;
    }

    .rsvp-list {
      margin-top: 30px;
    }

    .rsvp-item {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 15px;
      border-left: 4px solid #667eea;
    }

    .rsvp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .rsvp-header h3 {
      margin: 0;
      color: #333;
    }

    .attendance-badge {
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9em;
      font-weight: 600;
    }

    .attendance-badge.attending {
      background: #d4edda;
      color: #155724;
    }

    .attendance-badge.not-attending {
      background: #f8d7da;
      color: #721c24;
    }

    .rsvp-details {
      color: #666;
      line-height: 1.6;
    }

    .rsvp-details div {
      margin-bottom: 5px;
    }

    .submission-date {
      font-size: 0.9em;
      color: #888;
      margin-top: 10px;
    }

    @media (max-width: 768px) {
      .rsvp-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  rsvps: RsvpResponse[] = [];
  stats: any = null;
  loading = true;
  errorMessage = '';

  constructor(private rsvpService: RsvpService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    this.errorMessage = '';

    try {
      // Load RSVPs and stats in parallel
      const [rsvps, stats] = await Promise.all([
        this.rsvpService.getAllRsvps(),
        this.rsvpService.getRsvpStats()
      ]);

      this.rsvps = rsvps;
      this.stats = stats;
    } catch (error) {
      console.error('Error loading data:', error);
      this.errorMessage = 'Failed to load RSVP data. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async refreshData() {
    await this.loadData();
  }
}
