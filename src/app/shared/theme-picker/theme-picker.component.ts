import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { Subscription } from 'rxjs';

import { ThemeManager } from './theme-manager';
import { AppTheme } from '../../models/AppTheme';
import { ConfigurationService } from '../../services/configuration.service';

@Component({
  selector: 'app-theme-picker',
  templateUrl: 'theme-picker.component.html',
  styleUrls: ['theme-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ThemePickerComponent implements OnInit, OnDestroy {
  @Input() tooltip = 'Theme';
  
  public dropdownItems: ItemModel[] = [];
  private configSubscription: Subscription;

  constructor(
    public themeManager: ThemeManager,
    private configuration: ConfigurationService
  ) {}
  
  ngOnInit(): void {
    // Subscribe to configuration changes
    this.configSubscription = this.configuration.configurationImported$.subscribe(() => {
      const theme = this.currentTheme;
      if (theme) {
        this.setTheme(theme);
      }
    });
    
    // Set initial theme
    const theme = this.currentTheme;
    if (theme) {
      this.setTheme(theme);
    }
    
    // Setup dropdown items
    this.setupDropdownItems();
  }
  
  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
    }
  }
  
  private setupDropdownItems(): void {
    this.dropdownItems = this.themeManager.themes.map(theme => {
      return {
        text: theme.name,
        iconCss: theme.isDark ? 'e-icons e-moon' : 'e-icons e-day',
        id: theme.id.toString()
      };
    });
  }

  get currentTheme(): AppTheme | null {
    return this.themeManager.getThemeByID(this.configuration.themeId);
  }

  setTheme(theme: AppTheme): void {
    if (theme) {
      this.themeManager.installTheme(theme);
      this.configuration.themeId = theme.id;
    }
  }
  
  public select(args: any): void {
    if (!args || !args.item || !args.item.id) return;
    
    const selectedId = parseInt(args.item.id, 10);
    const theme = this.themeManager.getThemeByID(selectedId);
    if (theme) {
      this.setTheme(theme);
    }
  }
}

// Module definition moved to shared.module.ts