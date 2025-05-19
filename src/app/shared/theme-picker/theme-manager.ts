import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { AppTheme } from '../../models/AppTheme';

@Injectable({
  providedIn: 'root'
})
export class ThemeManager {
  // Available themes
  themes: Array<AppTheme> = [
    {
      id: 1,
      name: 'Indigo/Pink',
      primary: '#3F51B5',
      accent: '#E91E63',
      cssClass: 'indigo-pink-theme',
      isDark: false,
      isDefault: true,
    },
    {
      id: 2,
      name: 'Purple/Amber',
      primary: '#673AB7',
      accent: '#FFC107',
      cssClass: 'deeppurple-amber-theme',
      isDark: false,
    },
    {
      id: 3,
      name: 'Pink/Blue',
      primary: '#E91E63',
      accent: '#607D8B',
      cssClass: 'pink-bluegrey-theme',
      isDark: true,
    },
    {
      id: 4,
      name: 'Purple/Green',
      primary: '#9C27B0',
      accent: '#4CAF50',
      cssClass: 'purple-green-theme',
      isDark: true,
    },
  ];

  // Keys for local storage
  private readonly themeKey = 'app_theme';

  // Current theme
  private currentThemeSubject = new BehaviorSubject<AppTheme>(this.themes[0]);
  currentTheme$ = this.currentThemeSubject.asObservable();

  constructor(private localStorage: LocalStoreManager) {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedThemeId = this.localStorage.getDataObject<number>(this.themeKey);
    if (savedThemeId) {
      const theme = this.getThemeByID(savedThemeId);
      if (theme) {
        this.installTheme(theme);
      }
    } else {
      // Use default theme
      const defaultTheme = this.themes.find(t => t.isDefault);
      if (defaultTheme) {
        this.installTheme(defaultTheme);
      }
    }
  }

  public installTheme(theme: AppTheme): void {
    if (!theme) return;

    // Save to local storage
    this.localStorage.savePermanentData(theme.id, this.themeKey);

    // Remove all existing theme classes
    document.body.classList.remove(
      'indigo-pink-theme', 
      'deeppurple-amber-theme', 
      'pink-bluegrey-theme', 
      'purple-green-theme',
      'theme-dark'
    );

    // Add new theme class
    if (!theme.isDefault) {
      document.body.classList.add(theme.cssClass);
    }

    // Set preferred color scheme meta tag
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.primary);
    }

    // Update the dark mode preference
    if (theme.isDark) {
      document.body.classList.add('theme-dark');
    }

    // Notify subscribers
    this.currentThemeSubject.next(theme);
  }

  /**
   * Get theme by ID
   * @param id The theme ID to find
   * @returns The found theme or null if not found
   */
  public getThemeByID(id: number): AppTheme | null {
    return this.themes.find(theme => theme.id === id) || null;
  }
}