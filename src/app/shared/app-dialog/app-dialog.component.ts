import { Component, ViewChild, OnInit } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

import { AlertDialog, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from '../../services/app-translation.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './app-dialog.component.html',
  styleUrls: ['./app-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule]
})
export class AppDialogComponent implements OnInit {
  @ViewChild('ejDialog', { static: false }) ejDialog: DialogComponent;
  
  public dialogData: AlertDialog | null = null;
  public visible: boolean = false;
  public result: string = '';
  public animationSettings: Object = { effect: 'Zoom' };

  get showTitle(): boolean {
    return !!this.dialogData?.title && this.dialogData.title.length > 0;
  }

  get title(): string {
    return this.dialogData?.title || '';
  }

  get message(): string {
    return this.dialogData?.message || '';
  }

  get okLabel(): string {
    return this.dialogData?.okLabel || 'OK';
  }

  get cancelLabel(): string {
    return this.dialogData?.cancelLabel || 'CANCEL';
  }

  get showCancel(): boolean {
    return this.dialogData?.type !== DialogType.alert;
  }

  get isPrompt(): boolean {
    return this.dialogData?.type === DialogType.prompt;
  }

  constructor(private translationService: AppTranslationService) { }

  ngOnInit() {
    // Dialog is initialized here but will be shown when data is passed
  }

  // Method to open the dialog with data
  public openDialog(data: AlertDialog) {
    this.dialogData = data;
    this.result = data.defaultValue || '';
    this.visible = true;
  }

  ok() {
    if (this.dialogData) {
      if (this.dialogData.type === DialogType.prompt) {
        if (this.dialogData.okCallback) {
          this.dialogData.okCallback(this.result || this.dialogData.defaultValue);
        }
      } else {
        if (this.dialogData.okCallback) {
          this.dialogData.okCallback();
        }
      }
    }
    this.visible = false;
  }

  cancel(): void {
    if (this.dialogData?.cancelCallback) {
      this.dialogData.cancelCallback();
    }
    this.visible = false;
  }
  
  // Dialog lifecycle events
  public onDialogClose() {
    // Only trigger cancel if dialog is closed by clicking outside
    if (this.showCancel) {
      this.cancel();
    }
  }
}