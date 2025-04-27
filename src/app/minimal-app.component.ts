import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <div style="text-align:center; padding: 20px;">
      <h1>Coordinate App UI</h1>
      <p>Angular 19 Minimal Starter</p>
      <p>Successfully started without dotnet dependencies</p>
    </div>
  `,
  styles: [`
    :host {
      font-family: Arial, sans-serif;
      display: block;
      padding: 20px;
    }
    h1 {
      color: #3f51b5;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class MinimalAppComponent {
  title = 'Coordinate App';
}