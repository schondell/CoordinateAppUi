import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  GridComponent, 
  GridModule, 
  CommandModel, 
  EditSettingsModel,
  ToolbarItems,
  PageService,
  SortService,
  FilterService,
  GroupService,
  ToolbarService,
  EditService,
  CommandColumnService,
  CommandClickEventArgs
} from '@syncfusion/ej2-angular-grids';
import { 
  DialogModule,
  TooltipModule 
} from '@syncfusion/ej2-angular-popups';
import { 
  ButtonModule,
  CheckBoxModule 
} from '@syncfusion/ej2-angular-buttons';
import { ToastModule } from '@syncfusion/ej2-angular-notifications';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { MachineAccountService } from '../../services/machine-account.service';
import { MachineAccount, AvailableScopes } from '../../models/machine-account.model';
import { MachineAccountDialogComponent } from '../machine-account-dialog/machine-account-dialog.component';
import { AppTranslationService } from '../../services/app-translation.service';

@Component({
  selector: 'app-machine-account-list',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    DialogModule,
    TooltipModule,
    ButtonModule,
    CheckBoxModule,
    ToastModule,
    MachineAccountDialogComponent
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService,
    ToolbarService,
    EditService,
    CommandColumnService
  ],
  templateUrl: './machine-account-list.component.html',
  styleUrls: ['./machine-account-list.component.scss']
})
export class MachineAccountListComponent implements OnInit {
  @ViewChild('grid') grid!: GridComponent;
  @ViewChild('machineAccountDialog') machineAccountDialog!: MachineAccountDialogComponent;

  public data: MachineAccount[] = [];
  public loading = false;
  public pageSettings = { pageSize: 10 };
  public toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Search'];
  public editSettings: EditSettingsModel = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    mode: 'Dialog'
  };

  public commands: CommandModel[] = [
    {
      title: 'Test Connection',
      buttonOption: { iconCss: 'e-icons e-play', cssClass: 'e-flat e-info' }
    },
    {
      title: 'Regenerate Secret',
      buttonOption: { iconCss: 'e-icons e-refresh', cssClass: 'e-flat e-warning' }
    },
    {
      title: 'View Scopes',
      buttonOption: { iconCss: 'e-icons e-eye', cssClass: 'e-flat e-primary' }
    }
  ];

  public filterSettings = { type: 'FilterBar' };
  public sortSettings = { columns: [{ field: 'machineName', direction: 'Ascending' }] };

  // Dialog state
  public showDialog = false;
  public dialogTitle = '';
  public editingMachineAccount: MachineAccount | null = null;

  constructor(
    private machineAccountService: MachineAccountService,
    private alertService: AlertService,
    private translationService: AppTranslationService
  ) {}

  ngOnInit(): void {
    this.loadMachineAccounts();
  }

  loadMachineAccounts(): void {
    this.loading = true;
    this.machineAccountService.getMachineAccounts().subscribe({
      next: (accounts) => {
        this.data = accounts;
        this.loading = false;
      },
      error: (error) => {
        this.alertService.showMessage(
          'Error',
          `Failed to load machine accounts: ${error.message}`,
          MessageSeverity.error
        );
        this.loading = false;
      }
    });
  }

  onToolbarClick(args: any): void {
    switch (args.item.id) {
      case 'grid_add':
        this.openCreateDialog();
        break;
      case 'grid_edit':
        if (this.grid.getSelectedRecords().length > 0) {
          const selectedAccount = this.grid.getSelectedRecords()[0] as MachineAccount;
          this.openEditDialog(selectedAccount);
        } else {
          this.alertService.showMessage('Warning', 'Please select a machine account to edit', MessageSeverity.warn);
        }
        break;
      case 'grid_delete':
        if (this.grid.getSelectedRecords().length > 0) {
          const selectedAccount = this.grid.getSelectedRecords()[0] as MachineAccount;
          this.confirmDelete(selectedAccount);
        } else {
          this.alertService.showMessage('Warning', 'Please select a machine account to delete', MessageSeverity.warn);
        }
        break;
    }
  }

  onCommandClick(args: CommandClickEventArgs): void {
    const rowData = args.rowData as MachineAccount;
    
    switch (args.commandColumn.title) {
      case 'Test Connection':
        this.testConnection(rowData);
        break;
      case 'Regenerate Secret':
        this.regenerateSecret(rowData);
        break;
      case 'View Scopes':
        this.viewScopes(rowData);
        break;
    }
  }

  openCreateDialog(): void {
    this.editingMachineAccount = null;
    this.dialogTitle = 'Create Machine Account';
    this.showDialog = true;
  }

  openEditDialog(account: MachineAccount): void {
    this.editingMachineAccount = account;
    this.dialogTitle = 'Edit Machine Account';
    this.showDialog = true;
  }

  onDialogSave(account: MachineAccount): void {
    this.loadMachineAccounts();
    this.showDialog = false;
    this.alertService.showMessage(
      'Success', 
      `Machine account ${this.editingMachineAccount ? 'updated' : 'created'} successfully`,
      MessageSeverity.success
    );
  }

  onDialogCancel(): void {
    this.showDialog = false;
  }

  confirmDelete(account: MachineAccount): void {
    const message = `Are you sure you want to delete the machine account "${account.machineName}"? This action cannot be undone.`;
    
    if (confirm(message)) {
      this.deleteMachineAccount(account);
    }
  }

  deleteMachineAccount(account: MachineAccount): void {
    this.machineAccountService.deleteMachineAccount(account.id).subscribe({
      next: () => {
        this.alertService.showMessage(
          'Success',
          `Machine account "${account.machineName}" deleted successfully`,
          MessageSeverity.success
        );
        this.loadMachineAccounts();
      },
      error: (error) => {
        this.alertService.showMessage(
          'Error',
          `Failed to delete machine account: ${error.message}`,
          MessageSeverity.error
        );
      }
    });
  }

  testConnection(account: MachineAccount): void {
    this.machineAccountService.testMachineAccount(account.id).subscribe({
      next: (result) => {
        const severity = result.success ? MessageSeverity.success : MessageSeverity.error;
        this.alertService.showMessage('Connection Test', result.message, severity);
      },
      error: (error) => {
        this.alertService.showMessage(
          'Error',
          `Connection test failed: ${error.message}`,
          MessageSeverity.error
        );
      }
    });
  }

  regenerateSecret(account: MachineAccount): void {
    const message = `Are you sure you want to regenerate the client secret for "${account.machineName}"? Existing integrations will need to be updated with the new secret.`;
    
    if (confirm(message)) {
      this.machineAccountService.regenerateSecret(account.id).subscribe({
        next: (result) => {
          const message = `New client secret generated: ${result.clientSecret}\n\nPlease copy this secret now as it won't be shown again.`;
          alert(message);
          this.loadMachineAccounts();
        },
        error: (error) => {
          this.alertService.showMessage(
            'Error',
            `Failed to regenerate secret: ${error.message}`,
            MessageSeverity.error
          );
        }
      });
    }
  }

  viewScopes(account: MachineAccount): void {
    const scopeNames = account.scopes || [];
    const scopeDetails = AvailableScopes.filter(s => scopeNames.includes(s.name));
    
    let message = `Scopes for "${account.machineName}":\n\n`;
    scopeDetails.forEach(scope => {
      message += `• ${scope.displayName}: ${scope.description}\n`;
    });
    
    if (scopeDetails.length === 0) {
      message += 'No scopes assigned.';
    }
    
    alert(message);
  }

  getScopeDisplayNames(scopes: string[]): string {
    if (!scopes || scopes.length === 0) return 'No scopes';
    
    const scopeDisplayNames = scopes.map(scopeName => {
      const scope = AvailableScopes.find(s => s.name === scopeName);
      return scope ? scope.displayName : scopeName;
    });
    
    return scopeDisplayNames.join(', ');
  }

  getStatusClass(account: MachineAccount): string {
    if (!account.isActive) return 'status-inactive';
    if (!account.isEnabled) return 'status-disabled';
    return 'status-active';
  }
}