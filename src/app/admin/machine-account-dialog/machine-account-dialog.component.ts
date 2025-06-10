import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  DialogModule 
} from '@syncfusion/ej2-angular-popups';
import { 
  ButtonModule,
  CheckBoxModule,
  SwitchModule 
} from '@syncfusion/ej2-angular-buttons';
import { 
  TextBoxModule,
  MaskedTextBoxModule 
} from '@syncfusion/ej2-angular-inputs';
import { 
  MultiSelectModule,
  DropDownListModule 
} from '@syncfusion/ej2-angular-dropdowns';

import { MachineAccountService } from '../../services/machine-account.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { 
  MachineAccount, 
  MachineAccountCreateRequest, 
  MachineAccountUpdateRequest,
  AvailableScopes,
  MachineScope 
} from '../../models/machine-account.model';

@Component({
  selector: 'app-machine-account-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    CheckBoxModule,
    SwitchModule,
    TextBoxModule,
    MaskedTextBoxModule,
    MultiSelectModule,
    DropDownListModule
  ],
  templateUrl: './machine-account-dialog.component.html',
  styleUrls: ['./machine-account-dialog.component.scss']
})
export class MachineAccountDialogComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() title = 'Machine Account';
  @Input() machineAccount: MachineAccount | null = null;
  
  @Output() save = new EventEmitter<MachineAccount>();
  @Output() cancel = new EventEmitter<void>();

  public form: FormGroup;
  public saving = false;
  public isEditMode = false;
  public availableScopes = AvailableScopes;
  public scopeCategories = ['Vehicle', 'Events', 'System', 'General'];
  
  // Syncfusion component settings
  public scopeFields = { text: 'displayName', value: 'name', groupBy: 'category' };
  public scopePlaceholder = 'Select scopes for this machine account';
  public scopeMode = 'CheckBox';

  constructor(
    private fb: FormBuilder,
    private machineAccountService: MachineAccountService,
    private alertService: AlertService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['machineAccount'] && this.form) {
      this.isEditMode = !!this.machineAccount;
      this.populateForm();
    }
    
    if (changes['visible'] && this.visible && this.form) {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      machineName: ['', [Validators.required, Validators.maxLength(100)]],
      machineDescription: ['', [Validators.maxLength(500)]],
      clientId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-_]+$/)]],
      clientSecret: [''],
      scopes: [[], [Validators.required]],
      isActive: [true],
      generateUsername: [true] // Helper field to auto-generate username
    });

    // Auto-generate clientId and username based on machine name
    this.form.get('machineName')?.valueChanges.subscribe(name => {
      if (name && !this.isEditMode) {
        const clientId = name.toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        this.form.patchValue({ clientId: clientId });
      }
    });
  }

  private populateForm(): void {
    if (this.machineAccount) {
      this.form.patchValue({
        machineName: this.machineAccount.machineName,
        machineDescription: this.machineAccount.machineDescription,
        clientId: this.machineAccount.clientId,
        scopes: this.machineAccount.scopes || [],
        isActive: this.machineAccount.isActive,
        generateUsername: false
      });
      
      // Disable clientId for existing accounts
      this.form.get('clientId')?.disable();
    } else {
      this.form.reset({
        machineName: '',
        machineDescription: '',
        clientId: '',
        clientSecret: '',
        scopes: [],
        isActive: true,
        generateUsername: true
      });
      
      // Enable clientId for new accounts
      this.form.get('clientId')?.enable();
    }
  }

  onSave(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    const formValue = this.form.value;

    if (this.isEditMode && this.machineAccount) {
      const updateRequest: MachineAccountUpdateRequest = {
        id: this.machineAccount.id,
        machineName: formValue.machineName,
        machineDescription: formValue.machineDescription,
        scopes: formValue.scopes,
        isActive: formValue.isActive
      };

      this.machineAccountService.updateMachineAccount(updateRequest).subscribe({
        next: (updatedAccount) => {
          this.saving = false;
          this.save.emit(updatedAccount);
        },
        error: (error) => {
          this.saving = false;
          this.alertService.showMessage(
            'Error',
            `Failed to update machine account: ${error.message}`,
            MessageSeverity.error
          );
        }
      });
    } else {
      const createRequest: MachineAccountCreateRequest = {
        userName: formValue.generateUsername ? formValue.clientId : formValue.clientId,
        machineName: formValue.machineName,
        machineDescription: formValue.machineDescription,
        clientId: formValue.clientId,
        clientSecret: formValue.clientSecret || this.generateClientSecret(),
        scopes: formValue.scopes,
        isActive: formValue.isActive
      };

      this.machineAccountService.createMachineAccount(createRequest).subscribe({
        next: (newAccount) => {
          this.saving = false;
          this.save.emit(newAccount);
          
          // Show the generated client secret
          if (!formValue.clientSecret) {
            this.alertService.showMessage(
              'Success',
              `Machine account created successfully.\n\nClient Secret: ${createRequest.clientSecret}\n\nPlease copy this secret as it won't be shown again.`,
              MessageSeverity.success
            );
          }
        },
        error: (error) => {
          this.saving = false;
          this.alertService.showMessage(
            'Error',
            `Failed to create machine account: ${error.message}`,
            MessageSeverity.error
          );
        }
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onGenerateSecret(): void {
    const secret = this.generateClientSecret();
    this.form.patchValue({ clientSecret: secret });
  }

  private generateClientSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (control.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} is too long`;
      }
      if (control.errors['pattern']) {
        return `${this.getFieldDisplayName(fieldName)} contains invalid characters`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'machineName': 'Machine Name',
      'machineDescription': 'Description',
      'clientId': 'Client ID',
      'clientSecret': 'Client Secret',
      'scopes': 'Scopes'
    };
    return displayNames[fieldName] || fieldName;
  }

  getScopesByCategory(category: string): MachineScope[] {
    return this.availableScopes.filter(scope => scope.category === category);
  }

  getScopeDescription(scopeName: string): string {
    const scope = this.availableScopes.find(s => s.name === scopeName);
    return scope ? scope.description : '';
  }
}