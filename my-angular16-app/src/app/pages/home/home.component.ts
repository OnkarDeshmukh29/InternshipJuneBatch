import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  teamForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // 1. Initialize the parent form
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      // 2. Initialize the FormArray with one empty member by default
      members: this.fb.array([this.createMemberGroup()])
    });
  }
// {
//   {
//     "name":"John Doe",
//     "role":"Developer"
//   },
//   {
//     "name":"Jane Doe",
//     "role":"Designer"
//   }
// }
  // Helper method to get the FormArray
  get members(): FormArray {
    return this.teamForm.get('members') as FormArray;
  }

  // Helper method to create a FormGroup for a single team member
  createMemberGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  // Push a new member form group to the array
  addMember(): void {
    this.members.push(this.createMemberGroup());
  }

  // Remove a member form group from the array at a specific index
  removeMember(index: number): void {
    if (this.members.length > 1) {
      this.members.removeAt(index);
    }
  }

  // Submit the entire team structure (parent + array of children) to Django
  onSubmit(): void {
    if (this.teamForm.invalid) return;

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = this.teamForm.value;

    this.http.post(`${environment.apiUrl}/users/teams/`, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = 'Team and members successfully saved to the database!';
        
        // Reset the form back to its initial state (1 empty member)
        this.teamForm.reset();
        while (this.members.length > 1) {
          this.members.removeAt(1);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to save team.';
        console.error(err);
      }
    });
  }
}
