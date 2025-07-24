import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RsvpService, RsvpResponse } from '../services/rsvp.service';

@Component({
  selector: 'app-rsvp-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <!-- Party Header -->
      <div class="card">
        <div class="header-content">
          <div>
            <h1 class="party-header">🎉 You're Invited! 🎉</h1>
            <h2 style="text-align: center; color: #667eea; margin-bottom: 30px;">Shindig 2</h2>
          </div>
          <div class="nav-buttons">
            <a routerLink="/rsvps" class="btn btn-secondary">📋 View RSVPs</a>
            <a routerLink="/comments" class="btn btn-secondary">� Comments</a>
          </div>
        </div>
        
        <!-- Party Details -->
        <div class="party-details">
          <div class="detail-item">
            <span class="detail-icon">📅</span>
            <div>
              <strong>Date & Time:</strong><br>
              Saturday, August 23rd, 2025 at or around 3:02 PM
            </div>
          </div>
          
          <div class="detail-item">
            <span class="detail-icon">📍</span>
            <div>
              <strong>Party Location:</strong><br>
              <a href="https://maps.google.com/?q=2668+N+Staci+Ln,+Fayetteville,+AR+72704" target="_blank" style="color: #667eea; text-decoration: underline; font-weight: bold;">
                2668 N Staci Ln<br>
                Fayetteville, AR  72704  (North gate)
              </a>
              <div style="margin-top: 10px;">
                <a href="https://maps.google.com/?q=2668+N+Staci+Ln,+Fayetteville,+AR+72704" target="_blank" class="btn btn-secondary" style="background: #4285f4; border-color: #4285f4; color: white;">
                  🗺️ Get Directions
                </a>
              </div>
            </div>
          </div>
          <div class="detail-item">
            <span class="detail-icon">ℹ️</span>
            <div>
              <strong>Party Info:</strong><br>
              Pool party, no need to bring towels, we have plenty<br>
              We are working on transportation; more information to follow when available
              
            </div>
          </div>
          <div class="detail-item">
            <span class="detail-icon">🍽️</span>
            <div>
              <strong>Dinner:</strong><br>
              <em>Please let us know if you'll be staying for food!</em>
            </div>
          </div>
          
          <div class="detail-item">
            <span class="detail-icon">👕</span>
            <div>
              <strong>Want a commemorative shirt?</strong><br>
              Go to the website below, pick the shirt you want, then call Big Frog (<a href="tel:+14794640160" style="color: #28a745; text-decoration: underline; font-weight: bold; cursor: pointer;">479-464-0160</a>), pay and I'll pick them up and bring the to the party. Please order before August 11th, 2025.
              <div style="margin-top: 10px;">
                <a href="tel:+14794640160" class="btn btn-secondary" style="background: #28a745; border-color: #28a745; color: white;">
                  📞 Call Big Frog
                </a>
                <a href="http://bigfrog.com/nwa/" target="_blank" class="btn btn-secondary" style="margin-right: 10px;">
                  Order Your Shindig Shirt!
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RSVP Form -->
      <div class="card">
        <h2 style="color: #667eea; margin-bottom: 25px;">Please RSVP</h2>
        
        <form (ngSubmit)="submitRsvp()" #rsvpForm="ngForm">
          <div class="form-group">
            <label for="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              class="form-control"
              [(ngModel)]="rsvp.name"
              required
              placeholder="Enter your full name"
            />
          </div>

          <div class="form-group">
            <label>Will you be attending? *</label>
            <div class="radio-group">
              <div class="radio-item">
                <input
                  type="radio"
                  id="attending-yes"
                  name="attending"
                  [value]="true"
                  [(ngModel)]="rsvp.attending"
                  required
                />
                <label for="attending-yes">Yes, I'll be there! 🎉</label>
              </div>
              <div class="radio-item">
                <input
                  type="radio"
                  id="attending-no"
                  name="attending"
                  [value]="false"
                  [(ngModel)]="rsvp.attending"
                  required
                />
                <label for="attending-no">Sorry, can't make it 😢</label>
              </div>
            </div>
          </div>

          <div class="form-group" *ngIf="rsvp.attending">
            <label for="guestCount">How many people are coming? *</label>
            <select
              id="guestCount"
              name="guestCount"
              class="form-control"
              [(ngModel)]="rsvp.guestCount"
              required
            >
              <option value="">Select number of guests</option>
              <option [value]="1">Just me (1 person)</option>
              <option [value]="2">2 people</option>
              <option [value]="3">3 people</option>
              <option [value]="4">4 people</option>
              <option [value]="5">5 people</option>
              <option [value]="6">6+ people</option>
            </select>
          </div>

          <div class="form-group" *ngIf="rsvp.attending">
            <div class="checkbox-item">
              <input
                type="checkbox"
                id="stayingForFood"
                name="stayingForFood"
                [(ngModel)]="rsvp.stayingForFood"
              />
              <label for="stayingForFood">
                <strong>We'll be staying for dinner! 🍽️</strong><br>
                <small style="color: #666;">This helps us plan for catering</small>
              </label>
            </div>
          </div>

          <div class="form-group" style="text-align: center; margin-top: 30px;">
            <button
              type="submit"
              class="btn"
              [disabled]="!rsvpForm.form.valid || isSubmitting"
            >
              <span *ngIf="isSubmitting" class="loading">
                <span class="spinner"></span>
                Submitting...
              </span>
              <span *ngIf="!isSubmitting">
                Submit RSVP
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

      <!-- Footer -->
      <div class="card" style="text-align: center; background: rgba(255,255,255,0.9);">
        <p style="color: #667eea; margin-bottom: 10px;">
          <strong>Questions?</strong> Contact us at party&#64;shindig.com
        </p>
        <p style="color: #888; font-size: 14px;">
          Can't wait to celebrate with you! 🎊
        </p>
      </div>
    </div>
  `,
  styles: [`
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 15px;
    }

    .nav-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .nav-buttons {
        justify-content: center;
      }
    }
  `]
})
export class RsvpFormComponent {
  rsvp = {
    name: '',
    attending: null as boolean | null,
    guestCount: null as number | null,
    stayingForFood: false
  };

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private rsvpService: RsvpService) {}

  async submitRsvp() {
    if (!this.rsvp.name || this.rsvp.attending === null) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.rsvp.attending && !this.rsvp.guestCount) {
      this.errorMessage = 'Please select how many people are coming.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const rsvpData: RsvpResponse = {
        partitionKey: 'rsvp',
        rowKey: Date.now().toString(),
        name: this.rsvp.name,
        attending: this.rsvp.attending,
        guestCount: this.rsvp.attending ? (this.rsvp.guestCount || 1) : 0,
        stayingForFood: this.rsvp.attending ? this.rsvp.stayingForFood : false,
        submittedAt: new Date()
      };

      await this.rsvpService.submitRsvp(rsvpData);
      
      this.successMessage = this.rsvp.attending 
        ? `Thanks ${this.rsvp.name}! We're excited to see you at the party! 🎉`
        : `Thanks for letting us know, ${this.rsvp.name}. We'll miss you! 💔`;
      
      // Reset form
      this.rsvp = {
        name: '',
        attending: null,
        guestCount: null,
        stayingForFood: false
      };
      
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      this.errorMessage = 'Sorry, there was an error submitting your RSVP. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
