import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactUsService, ContactMessage } from './contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  viewMode: 'list' | 'form' = 'list';
  editingMessage: ContactMessage | null = null;

  // --- Template-Driven Form ---
  templateModel: ContactMessage = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  isTemplateSubmitting = false;
  templateSuccess = '';

  // --- Reactive Form ---
  reactiveForm!: FormGroup;
  isReactiveSubmitting = false;
  reactiveSuccess = '';

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

  showForm(msg?: ContactMessage): void {
    this.viewMode = 'form';
    this.reactiveSuccess = '';
    this.templateSuccess = '';

    if (msg) {
      this.editingMessage = msg;
      this.reactiveForm.patchValue(msg);
      // Optional: Patch template form too
      this.templateModel = { ...msg };
    } else {
      this.editingMessage = null;
      this.reactiveForm.reset();
      this.templateModel = { name: '', email: '', subject: '', message: '' };
    }
  }

  showList(): void {
    this.viewMode = 'list';
    this.editingMessage = null;
  }

  // Submit Template-Driven Form
  onSubmitTemplate(form: any) {
    if (form.invalid) return;

    this.isTemplateSubmitting = true;
    this.templateSuccess = '';

    const request$ = this.editingMessage && this.editingMessage.id
      ? this.contactService.updateMessage(this.editingMessage.id, this.templateModel)
      : this.contactService.createMessage(this.templateModel);

    request$.subscribe({
      next: () => {
        this.isTemplateSubmitting = false;
        this.templateSuccess = this.editingMessage ? 'Template form updated successfully!' : 'Template form sent successfully!';
        if (!this.editingMessage) form.resetForm();
        setTimeout(() => this.showList(), 1500);
      },
      error: (err) => {
        this.isTemplateSubmitting = false;
        console.error('Error in template form:', err);
      }
    });
  }

  // Submit Reactive Form
  onSubmitReactive() {
    if (this.reactiveForm.invalid) return;

    this.isReactiveSubmitting = true;
    this.reactiveSuccess = '';

    const data: ContactMessage = this.reactiveForm.value;
    
    const request$ = this.editingMessage && this.editingMessage.id
      ? this.contactService.updateMessage(this.editingMessage.id, data)
      : this.contactService.createMessage(data);

    request$.subscribe({
      next: () => {
        this.isReactiveSubmitting = false;
        this.reactiveSuccess = this.editingMessage ? 'Reactive form updated successfully!' : 'Reactive form sent successfully!';
        if (!this.editingMessage) this.reactiveForm.reset();
        setTimeout(() => this.showList(), 1500);
      },
      error: (err) => {
        this.isReactiveSubmitting = false;
        console.error('Error in reactive form:', err);
      }
    });
  }
}
