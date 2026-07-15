import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, User } from './user.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  viewMode: 'list' | 'form' = 'list';
  
  users: User[] = [];
  isLoading = false;
  error = '';
  searchTerm = '';
  searchStatus = '';
  
  userForm!: FormGroup;
  isSubmitting = false;
  editingUserId: string | number | null = null;
  successMessage = '';
  selectedFile: File | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required],
      status: ['Active', Validators.required]
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers(this.searchTerm, this.searchStatus).pipe(
      catchError(err => {
        console.error('Error fetching users', err);
        this.error = 'Failed to load users from the server.';
        // Mock data fallback
        return of([
          { id: 1, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', role: 'Admin', status: 'Active' },
          { id: 2, firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', role: 'User', status: 'Inactive' },
          { id: 3, firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', role: 'User', status: 'Inactive' },
          { id: 4, firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', role: 'User', status: 'Inactive' }

        ]);
      })
    ).subscribe(data => {
      this.users = data;
      console.log('Users loaded:', this.users);
      this.isLoading = false;
    });
  }

  onSearch(): void {
    this.loadUsers();
  }

  onFilterStatus(): void {
    this.loadUsers();
  }

  showForm(user?: User): void {
    this.viewMode = 'form';
    this.successMessage = '';
    this.selectedFile = null;
    
    if (user) {
      this.editingUserId = user.id as string | number;
      this.userForm.patchValue(user);
    } else {
      this.editingUserId = null;
      this.userForm.reset({ role: 'User', status: 'Active' });
    }
  }

  showList(): void {
    this.viewMode = 'list';
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = '';
    
    // Create FormData instead of a standard JSON object to handle file upload
    const formData = new FormData();
    const formValues = this.userForm.value;
    
    Object.keys(formValues).forEach(key => {
      formData.append(key, formValues[key]);
    });

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    const request$ = this.editingUserId
      ? this.userService.updateUser(this.editingUserId, formData)
      : this.userService.createUser(formData);

    request$.pipe(
      catchError(err => {
        // Mock success even if API fails for demonstration
        return of(formValues);
      })
    ).subscribe(() => {
      this.isSubmitting = false;
      this.successMessage = this.editingUserId ? 'User updated successfully!' : 'User registered successfully!';
      
      // Update local array for demonstration using the form values
      if (this.editingUserId) {
        const index = this.users.findIndex(u => u.id === this.editingUserId);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...formValues };
        }
      } else {
        this.users.push({ id: Math.floor(Math.random() * 1000), ...formValues });
      }

      this.selectedFile = null;
      setTimeout(() => this.showList(), 1500);
    });
  }

  deleteUser(id: string | number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).pipe(
        catchError(err => of(null)) // Mock success
      ).subscribe(() => {
        this.users = this.users.filter(u => u.id !== id);
      });
    }
  }
}
