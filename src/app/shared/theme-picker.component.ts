import { Component, ViewEncapsulation, ChangeDetectionStrategy, NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeManager } from './theme-manager';
import { AppTheme } from '../models/AppTheme';
import { ConfigurationService } from '../services/configuration.service';

// Import Syncfusion components
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';

@Component({
    selector: 'app-theme-picker',
    templateUrl: 'theme-picker.component.html',
    styleUrls: ['theme-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: { 'aria-hidden': 'true' },
})
export class ThemePicker {
    @Input()
    tooltip = 'Theme';

    public dropdownItems: any[] = [];

    constructor(
        public themeManager: ThemeManager,
        private configuration: ConfigurationService
    ) {
        configuration.configurationImported$.subscribe(() => this.setTheme(this.currentTheme));
        this.setTheme(this.currentTheme);
        this.setupDropdownItems();
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

    get currentTheme(): AppTheme {
        return this.themeManager.getThemeByID(this.configuration.themeId);
    }

    setTheme(theme: AppTheme) {
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

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        DropDownButtonModule,
        TooltipModule
    ],
    exports: [ThemePicker],
    declarations: [ThemePicker],
    providers: [ThemeManager, ConfigurationService],
})
export class ThemePickerModule { }