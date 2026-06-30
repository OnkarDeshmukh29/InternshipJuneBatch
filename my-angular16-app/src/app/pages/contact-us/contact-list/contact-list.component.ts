import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContactUsService, ContactMessage } from '../contact-us.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<ContactMessage>();

  messages: ContactMessage[] = [];
  isLoading = false;
  error = '';

  constructor(private contactService: ContactUsService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading = true;
    this.contactService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching messages', err);
        this.error = 'Failed to load messages from the server.';
        // Fallback to mock data for demonstration
        this.messages = [
          { id: 1, name: 'Alice Smith', email: 'alice@example.com', subject: 'Support Request', message: 'I need help with my account.' },
          { id: 2, name: 'Bob Jones', email: 'bob@example.com', subject: 'Feedback', message: 'Great application, really enjoying the UX.' }
        ];
        this.isLoading = false;
      }
    });
  }

  deleteMessage(id: string | number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this message?')) {
      this.contactService.deleteMessage(id).subscribe({
        next: () => {
          this.messages = this.messages.filter(m => m.id !== id);
        },
        error: (err) => {
          console.error('Error deleting message', err);
          // For demonstration, delete locally even if API fails
          this.messages = this.messages.filter(m => m.id !== id);
        }
      });
    }
  }
}
