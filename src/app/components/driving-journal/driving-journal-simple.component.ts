import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driving-journal-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="journal-container">
      <h2>Driving Journal</h2>
      <p>This is a simplified version of the driving journal component.</p>
      
      <div class="journal-filters">
        <div class="filter-group">
          <label>Date:</label>
          <input type="date" value="2025-04-01">
        </div>
        
        <div class="filter-group">
          <label>Vehicle:</label>
          <select>
            <option value="1">Vehicle 1</option>
            <option value="2">Vehicle 2</option>
            <option value="3">Vehicle 3</option>
          </select>
        </div>
        
        <button class="find-button">Find</button>
      </div>
      
      <table class="journal-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Distance</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2025-04-01</td>
            <td>08:00</td>
            <td>09:15</td>
            <td>45 km</td>
            <td>1h 15m</td>
            <td>Completed</td>
          </tr>
          <tr>
            <td>2025-04-01</td>
            <td>10:30</td>
            <td>11:45</td>
            <td>37 km</td>
            <td>1h 15m</td>
            <td>Completed</td>
          </tr>
          <tr>
            <td>2025-04-01</td>
            <td>13:00</td>
            <td>14:20</td>
            <td>52 km</td>
            <td>1h 20m</td>
            <td>Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .journal-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      color: #3f51b5;
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 24px;
    }
    
    .journal-filters {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      padding: 15px;
      background-color: #f5f7ff;
      border-radius: 8px;
      align-items: flex-end;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    label {
      font-weight: 500;
      font-size: 14px;
      color: #555;
    }
    
    input, select {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      min-width: 200px;
    }
    
    .find-button {
      background-color: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 20px;
      font-weight: 500;
      cursor: pointer;
      height: 36px;
    }
    
    .find-button:hover {
      background-color: #303f9f;
    }
    
    .journal-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .journal-table th,
    .journal-table td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    .journal-table th {
      background-color: #f5f7ff;
      font-weight: 500;
      color: #3f51b5;
    }
    
    .journal-table tbody tr:hover {
      background-color: #f5f7ff;
    }
    
    @media (max-width: 768px) {
      .journal-filters {
        flex-direction: column;
        align-items: stretch;
      }
      
      .journal-table {
        font-size: 14px;
      }
      
      .journal-table th,
      .journal-table td {
        padding: 8px 10px;
      }
    }
  `]
})
export class DrivingJournalSimpleComponent {
  constructor() {}
}