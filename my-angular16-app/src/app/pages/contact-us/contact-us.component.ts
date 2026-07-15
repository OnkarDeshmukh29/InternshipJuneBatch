import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactUsService } from './contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  reactiveForm!: FormGroup;
  isReactiveSubmitting = false;
  reactiveSuccess = '';
  reactiveError = '';
  selectedFile: File | null = null;

  constructor(
    private contactService: ContactUsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Initialize Reactive Form
    this.reactiveForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log(this.selectedFile);

    }
  }

  onSubmitReactive() {
    if (this.reactiveForm.invalid) return;

    this.isReactiveSubmitting = true;
    this.reactiveSuccess = '';
    this.reactiveError = '';

    const formValues = this.reactiveForm.value;
    console.log(formValues);
    
    const formData = new FormData();
    console.log(formData);
    
  
    // Append all text fields
    Object.keys(formValues).forEach(key => {
      formData.append(key, formValues[key]);
    });

    // Append the file if it exists
    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile);
    }

    this.contactService.createMessage(formData).subscribe({
      next: () => {
        this.isReactiveSubmitting = false;
        this.reactiveSuccess = 'Your message has been sent successfully! Our support team will get back to you soon.';
        this.reactiveForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        this.isReactiveSubmitting = false;
        this.reactiveError = 'Failed to send message. Please try again.';
        console.error('Error sending message:', err);
      }
    });
  }
}
