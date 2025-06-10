import { Component, OnDestroy, ViewChild, Input, OnChanges, NgZone, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { CheckBoxModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { TranslateModule } from '@ngx-translate/core';

import { AccountService } from '../../services/account.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { Utilities } from '../../services/utilities';
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { DBkeys } from '../../services/db-keys';
import { User } from '../../models/user.model';
import { UserEdit } from '../../models/user-edit.model';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { EqualValidator } from '../../shared/validators/equal.validator';

interface UserProfileForm {
  jobTitle: FormControl<string>;
  userName: FormControl<string>;
  email: FormControl<string>;
  password: FormGroup<{
    currentPassword: FormControl<string>;
    newPassword: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;
  roles: FormControl<string[]>;
  fullName: FormControl<string>;
  phoneNumber: FormControl<string>;
  isEnabled: FormControl<boolean>;
  isLockedOut?: FormControl<boolean>;
}

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextBoxModule,
    DropDownListModule,
    MultiSelectModule,
    ButtonModule,
    CheckBoxModule,
    SwitchModule,
    TranslateModule
  ]
})
export class UserEditorComponent implements OnChanges, OnDestroy {
  @ViewChild('form', { static: true })
  private form: NgForm;

  isNewUser = false;
  isChangePassword = false;
  emailConfirmed: boolean;
  public userHasPassword = true;
  public isSaving = false;
  public isSendingEmail = false;
  private passwordWatcher: Subscription;
  private onUserSaved = new Subject<User>();

  @Input() user: User = new User();
  @Input() roles: Role[] = [];
  @Input() isEditMode = false;

  userProfileForm: FormGroup<UserProfileForm>;
  userSaved$ = this.onUserSaved.asObservable();

  get confirmedEmailChanged() {
    return this.emailConfirmed && this.email.value !== this.user.email;
  }

  get userName() {
    return this.userProfileForm.get('userName');
  }

  get email() {
    return this.userProfileForm.get('email');
  }

  get password() {
    return this.userProfileForm.get('password');
  }

  get currentPassword() {
    return this.password.get('currentPassword');
  }

  get newPassword() {
    return this.password.get('newPassword');
  }

  get confirmPassword() {
    return this.password.get('confirmPassword');
  }

  get assignedRoles() {
    return this.userProfileForm.get('roles');
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(Permission.viewRolesPermission);
  }

  get canAssignRoles() {
    return this.accountService.userHasPermission(Permission.assignRolesPermission);
  }

  get isEditingSelf() {
    return this.accountService.currentUser ? this.user.id === this.accountService.currentUser.id : false;
  }

  get assignableRoles(): Role[] {
    return this.roles;
  }

  get floatLabels(): string {
    return this.isEditMode ? 'auto' : 'always';
  }

  constructor(
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private accountService: AccountService,
    private localStorage: LocalStoreManager,
    private formBuilder: FormBuilder,
    private ngZone: NgZone
  ) {
    this.buildForm();
  }

  ngOnChanges() {
    if (this.user) {
      this.isNewUser = false;
      this.emailConfirmed = this.user.emailConfirmed;

      const verificationEmailSent = this.localStorage.getDataObject<boolean>(this.getDBkey_VERIFICATION_EMAIL_SENT(this.user.id));

      if (this.isEditingSelf) {

        this.loadCurrentUserPasswordStatus();

        if (!verificationEmailSent && !this.emailConfirmed) {
          const sendVerificationEmailWindowsFuncName = 'userEditor_sendVerificationEmail';
          window[sendVerificationEmailWindowsFuncName] = this.sendVerificationEmail.bind(this);

          const confirmEmailMsg = 'Your account email has not been verified. <a href="javascript:;" ' +
            `onclick="window.${sendVerificationEmailWindowsFuncName}()">Click here to resend verification email</a>`;
          this.alertService.showStickyMessage('Email not verified!', confirmEmailMsg, MessageSeverity.info, null, () => window[sendVerificationEmailWindowsFuncName] = null);
        }
      }
    } else {
      this.isNewUser = true;
      this.user = new User();
      this.user.isEnabled = true;
    }

    this.setRoles();

    this.resetForm();
  }

  ngOnDestroy() {
    this.passwordWatcher.unsubscribe();
  }

  public setUser(user?: User, roles?: Role[]) {
    this.user = user;
    if (roles) {
      this.roles = [...roles];
    }

    this.ngOnChanges();
  }

  private buildForm() {
    this.userProfileForm = this.formBuilder.group({
      jobTitle: '',
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: this.formBuilder.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]],
        confirmPassword: ['', [Validators.required, EqualValidator('newPassword')]],
      }),
      roles: this.formBuilder.control([] as string[], Validators.required),
      fullName: '',
      phoneNumber: '',
      isEnabled: false as boolean
    });

    this.passwordWatcher = this.newPassword.valueChanges.subscribe(() => this.confirmPassword.updateValueAndValidity());
  }

  public resetForm(stopEditing = false) {
    if (stopEditing) {
      this.isEditMode = false;
    }

    if (!this.user) {
      this.isNewUser = true;
      this.user = new User();
    }

    if (this.isNewUser) {
      this.isChangePassword = true;
      this.addNewPasswordValidators();
    } else {
      this.isChangePassword = false;
      this.newPassword.clearValidators();
      this.confirmPassword.clearValidators();
    }

    this.currentPassword.clearValidators();

    this.userProfileForm.reset({
      jobTitle: this.user.jobTitle || '',
      userName: this.user.userName || '',
      email: this.user.email || '',
      password: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      roles: this.user.roles || [],
      fullName: this.user.fullName || '',
      phoneNumber: this.user.phoneNumber || '',
      isEnabled: this.user.isEnabled
    });
  }

  private setRoles() {
    if (this.user.roles) {
      for (const role of this.user.roles) {
        if (!this.roles.some(r => r.name === role)) {
          this.roles.unshift(new Role(role));
        }
      }
    }
  }

  public beginEdit() {
    this.isEditMode = true;
    this.isChangePassword = false;
  }

  public save() {
    if (!this.form.submitted) {
      // Causes validation to update.
      this.form.onSubmit(null);
      return;
    }

    if (!this.userProfileForm.valid) {
      this.alertService.showValidationError();
      return;
    }

    this.isSaving = true;
    this.alertService.startLoadingMessage('Saving changes...');

    const editedUser = this.getEditedUser();

    if (this.isNewUser) {
      this.accountService.newUser(editedUser).subscribe({
        next: user => this.saveCompleted(user),
        error: error => this.saveFailed(error)
      });
    } else {
      this.accountService.updateUser(editedUser).subscribe({
        next: _ => this.saveCompleted(editedUser),
        error: error => this.saveFailed(error)
      });
    }
  }

  public cancel() {
    this.resetForm();
    this.isEditMode = false;

    this.alertService.resetStickyMessage();
  }

  private getEditedUser(): UserEdit {
    const formModel = this.userProfileForm.value;

    return {
      id: this.user.id,
      jobTitle: formModel.jobTitle,
      userName: formModel.userName,
      fullName: formModel.fullName,
      friendlyName: (<UserEdit><unknown>formModel).friendlyName,
      email: formModel.email,
      emailConfirmed: this.user.emailConfirmed,
      phoneNumber: formModel.phoneNumber,
      roles: formModel.roles,
      currentPassword: formModel.password.currentPassword,
      newPassword: this.isChangePassword ? formModel.password.newPassword : null,
      confirmPassword: this.isChangePassword ? formModel.password.confirmPassword : null,
      isEnabled: formModel.isEnabled,
      isLockedOut: this.user.isLockedOut
    };
  }

  private saveCompleted(user?: User) {
    if (user) {
      this.raiseEventIfRolesModified(this.user, user);
      this.user = user;
    }

    this.isSaving = false;
    this.alertService.stopLoadingMessage();

    if (this.isEditingSelf && this.isChangePassword) {
      this.loadCurrentUserPasswordStatus();
    }

    this.resetForm(true);

    this.onUserSaved.next(this.user);
  }

  private saveFailed(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage('Save Error', 'One or more errors occurred whilst saving your changes:', MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }

  private raiseEventIfRolesModified(currentUser: User, editedUser: User) {
    const rolesAdded = this.isNewUser ? editedUser.roles : editedUser.roles.filter(role => currentUser.roles.indexOf(role) === -1);
    const rolesRemoved = this.isNewUser ? [] : currentUser.roles.filter(role => editedUser.roles.indexOf(role) === -1);

    const modifiedRoles = rolesAdded.concat(rolesRemoved);

    if (modifiedRoles.length) {
      setTimeout(() => this.accountService.onRolesUserCountChanged(modifiedRoles));
    }
  }


  // roles mat-select readonly workaround
  rolesChanged() {
    if (!this.isEditMode || !this.canAssignRoles) {
      this.assignedRoles.setValue(this.user.roles || []);
    }
  }
  // roles mat-select readonly workaround
  rolesOpened(matSelect) {
    if (!this.isEditMode || !this.canAssignRoles) {
      matSelect.close();
    }
  }


  sendVerificationEmail() {
    this.ngZone.run(() => {
      this.isSendingEmail = true;
      this.alertService.resetStickyMessage();
      this.alertService.startLoadingMessage('Sending verification email...');

      this.accountService.sendConfirmEmail()
        .subscribe({
          next: _ => {
            this.isSendingEmail = false;
            this.alertService.stopLoadingMessage();
            this.alertService.showMessage('Verification Email Sent', 'Please check your email', MessageSeverity.success);
            this.localStorage.saveSyncedSessionData(true, this.getDBkey_VERIFICATION_EMAIL_SENT(this.user.id));
          },
          error: error => {
            this.isSendingEmail = false;
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage('Verification Email Not Sent', `Unable to send verification email.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
              MessageSeverity.error, error);
          }
        });
    });
  }

  private loadCurrentUserPasswordStatus() {
    this.accountService.getUserHasPassword()
      .subscribe({
        next: hasPassword => {
          this.userHasPassword = hasPassword;
        },
        error: error => {
          this.alertService.showStickyMessage('Load Error', `Error retrieving user password status from the server.\r\nErrors: "${Utilities.getHttpResponseMessages(error)}"`,
            MessageSeverity.error, error);
        }
      });
  }

  private getDBkey_VERIFICATION_EMAIL_SENT(userId: string) {
    return `verification_email_sent:${userId}`;
  }

  public changePassword() {
    this.isChangePassword = true;
    this.addCurrentPasswordValidators();
    this.addNewPasswordValidators();
  }

  private addCurrentPasswordValidators() {
    this.currentPassword.setValidators(Validators.required);
  }

  private addNewPasswordValidators() {
    this.newPassword.setValidators([Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)]);
    this.confirmPassword.setValidators([Validators.required, EqualValidator('newPassword')]);
  }

  public unlockUser() {
    this.isSaving = true;
    this.alertService.startLoadingMessage('Unblocking user...');

    this.accountService.unblockUser(this.user.id)
      .subscribe({
        next: _ => {
          this.isSaving = false;
          this.user.isLockedOut = false;
          this.userProfileForm.patchValue({
            isLockedOut: this.user.isLockedOut
          });
          this.alertService.stopLoadingMessage();
          this.alertService.showMessage('Success', 'User has been successfully unlocked', MessageSeverity.success);
        },
        error: error => {
          this.isSaving = false;
          this.alertService.stopLoadingMessage();
          this.alertService.showStickyMessage('Unblock Error', 'The below errors occurred whilst unlocking the user:', MessageSeverity.error, error);
          this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        }
      });
  }
}
