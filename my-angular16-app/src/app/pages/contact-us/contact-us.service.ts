import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactMessage {
  id?: number | string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) { }

  // GET: Retrieve all messages
  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl);
  }

  // GET by ID: Retrieve a single message
  getMessageById(id: string | number): Observable<ContactMessage> {
    return this.http.get<ContactMessage>(`${this.apiUrl}/${id}`);
  }

  // POST: Create a new message (Updated to accept FormData for file uploads)
  createMessage(data: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/', data);
  }

  // PUT: Update an existing message
  updateMessage(id: string | number, data: Partial<ContactMessage>): Observable<ContactMessage> {
    return this.http.put<ContactMessage>(`${this.apiUrl}/${id}`, data);
  }

  // DELETE: Delete a message
  deleteMessage(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
