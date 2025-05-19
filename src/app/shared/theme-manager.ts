import { Injectable } from '@angular/core';
import { AppTheme } from '../models/AppTheme';

@Injectable({ providedIn: 'root' })
export class ThemeManager {
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

  installTheme(theme: AppTheme) {
    // Remove any existing theme classes from the body element
    document.body.classList.remove(
      'indigo-pink-theme', 
      'deeppurple-amber-theme', 
      'pink-bluegrey-theme', 
      'purple-green-theme',
      'theme-dark'
    );
    
    // Apply the theme class
    if (theme && !theme.isDefault) {
      document.body.classList.add(theme.cssClass);
    }
    
    // Apply dark theme class if needed
    if (theme && theme.isDark) {
      document.body.classList.add('theme-dark');
    }
    
    // Store the current theme in localStorage for persistence
    if (theme) {
      localStorage.setItem('themeId', theme.id.toString());
    }
  }

  getThemeByID(id: number): AppTheme {
    return this.themes.find(theme => theme.id === id) || this.themes[0];
  }
}