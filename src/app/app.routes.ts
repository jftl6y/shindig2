import { Routes } from '@angular/router';
import { RsvpFormComponent } from './components/rsvp-form.component';
import { RsvpListComponent } from './components/rsvp-list.component';
import { CommentsComponent } from './components/comments.component';

export const routes: Routes = [
  { path: '', component: RsvpFormComponent },
  { path: 'rsvps', component: RsvpListComponent },
  { path: 'comments', component: CommentsComponent },
  { path: '**', redirectTo: '' }
];
