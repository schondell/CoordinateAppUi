import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';
import { ToDoTask } from './todo-demo.component';

interface TaskForm {
  taskName: FormControl<string>;
  description: FormControl<string>;
  isImportant: FormControl<boolean>;
}

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: 'add-task-dialog.component.html',
  styleUrls: ['add-task-dialog.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    TranslateModule
  ]
})
export class AddTaskDialogComponent {
  taskForm: FormGroup<TaskForm>;

  get taskName() {
    return this.taskForm.get('taskName');
  }

  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    private alertService: AlertService,
    private translationService: AppTranslationService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  save() {
    if (this.taskForm.valid) {
      const formModel = this.taskForm.value;

      const newtask: ToDoTask = {
        name: formModel.taskName,
        description: formModel.description,
        isImportant: formModel.isImportant,
        isComplete: false
      };

      this.dialogRef.close(newtask);
    } else {
      this.alertService.showStickyMessage(this.translationService.getTranslation('form.ErrorCaption'), this.translationService.getTranslation('form.ErrorMessage'), MessageSeverity.error);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  private buildForm() {
    this.taskForm = this.formBuilder.group({
      taskName: ['', Validators.required],
      description: '',
      isImportant: false as boolean
    });
  }
}
