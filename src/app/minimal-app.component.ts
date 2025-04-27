import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <header>
        <h1>Coordinate App UI</h1>
        <nav>
          <ul>
            <li><a routerLink="/">Home</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section class="content">
          <h2>Angular 19 Migration</h2>
          <p>Successfully bootstrapped using standalone components</p>
          <p>The application is now running in minimal mode while the full migration to Angular 19 is in progress.</p>
          
          <div class="info-box">
            <h3>Migration Status</h3>
            <p>The original application has module structure incompatible with Angular 19.</p>
            <p>This minimal version allows development to continue while components are migrated.</p>
          </div>
        </section>
      </main>
      
      <footer>
        <p>Coordinate App UI - Angular 19.2.8</p>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: block;
      color: #333;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
      margin-bottom: 30px;
    }
    
    h1 {
      color: #3f51b5;
      margin: 0;
    }
    
    nav ul {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    nav li {
      margin-left: 20px;
    }
    
    nav a {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }
    
    .content {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 30px;
    }
    
    .info-box {
      background-color: #e8eaf6;
      border-left: 4px solid #3f51b5;
      padding: 15px;
      margin-top: 20px;
      border-radius: 4px;
    }
    
    footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #666;
    }
  `],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MinimalAppComponent {
  title = 'Coordinate App';
}