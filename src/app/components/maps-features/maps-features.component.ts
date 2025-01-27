import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MapCardComponent} from "../map-card/map-card.component";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-maps-features',
  templateUrl: './maps-features.component.html',
  standalone: true,
  imports: [
    MapCardComponent,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./maps-features.component.css']
})
export class MapsFeaturesComponent implements OnInit {
  searchValue: string = '';
  sortingValue: string = '';
  filteringValue: string[] = [];
  cardDatas: CardDataModel[] = [];

  sortingType: string[] = ['Ascending', 'Descending'];
  filteringType: string[] = ['Client-side', 'Server-side', 'Front-end'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cardDatas = this.getCardDatas();
  }

  getCardDatas(): CardDataModel[] {
    return [
      { title: 'ASP.NET MVC', subTitle: 'Nick Harrison', content: 'ASP.NET Model View Controller design pattern to keep the data, views, and logic clearly separated in apps.', navUrl: 'https://www.syncfusion.com/ebooks/ASPNET_MVC_Succinctly', tag: 'Server-side' },
      { title: 'Node.js', subTitle: 'Emanuele DelBono', content: 'Node.js is a wildly popular platform for writing web applications that has revolutionized web development in many ways.', navUrl: 'https://www.syncfusion.com/ebooks/nodejs', tag: 'Client-side' },
      { title: 'React.js', subTitle: 'Dmitri Nesteruk', content: 'React is a JavaScript library that has revolutionized how developers design and think about views in web applications.', navUrl: 'https://www.syncfusion.com/ebooks/reactjs_succinctly', tag: 'Client-side' },
      { title: 'TypeScript', subTitle: 'Steve Fenton', content: 'Microsoft TypeScript extends many familiar features of .NET programming to JavaScript.', navUrl: 'https://www.syncfusion.com/ebooks/typescript', tag: 'Client-side' },
      { title: 'PHP', subTitle: 'Jose Roberto Olivas Mendoza', content: 'Known for its straightforward simplicity, PHP is an open source, general-purpose scripting language oriented for web development.', navUrl: 'https://www.syncfusion.com/ebooks/php_succinctly', tag: 'Server-side' },
      { title: 'CSS3', subTitle: 'Peter Shaw', content: 'In CSS3 Succinctly, author Peter Shaw provides an overview of the latest features available for custom cascading style sheets.', navUrl: 'https://www.syncfusion.com/ebooks/css3', tag: 'Front-end' },
      { title: 'ASP.NET Core', subTitle: 'Simone Chiaretta and Ugo Lattanzi', content: 'In ASP.NET Core Succinctly, seasoned authors Simone Chiaretta and Ugo Lattanzi update you on all the advances provided by Microsoft’s landmark framework.', navUrl: 'https://www.syncfusion.com/ebooks/asp_net_core_succinctly', tag: 'Server-side' },
      { title: 'Aurelia', subTitle: 'Matthew Duffield', content: 'Aurelia is a relatively new, open-source JavaScript library/framework that simplifies the creation of web-based applications.', navUrl: 'https://www.syncfusion.com/ebooks/aurelia_succinctly', tag: 'Client-side' },
      { title: 'ECMAScript 6', subTitle: 'Matthew Duffield', content: 'ECMAScript 6 (ES6), also known as ECMAScript 2015, brings new functionality and features to the table that developers have been wanting for a long time.', navUrl: 'https://www.syncfusion.com/ebooks/ecmascript_6_succinctly', tag: 'Client-side' },
      { title: 'JavaScript', subTitle: 'Cody Lindley', content: 'JavaScript Succinctly was written to give readers an accurate, concise examination of JavaScript objects and their supporting nuances.', navUrl: 'https://www.syncfusion.com/ebooks/javascript', tag: 'Client-side' },
      { title: 'Knockout.js', subTitle: 'Ryan Hodson', content: 'Knockout.js Succinctly is intended for professional web developers who need to build dynamic, scalable user interfaces with minimal code.', navUrl: 'https://www.syncfusion.com/ebooks/knockoutjs', tag: 'Client-side' },
      { title: 'Angular 2', subTitle: 'Joseph D.Booth', content: 'Angular 2 is a massively popular JavaScript framework built to take advantage of component development in web apps.', navUrl: 'https://www.syncfusion.com/ebooks/angular2_succinctly', tag: 'Client-side' }
    ];
  }

  navigateToUrl(url: string): void {
    window.open(url, '_blank');
  }

  getCardDatasByFilter(values: string[]): CardDataModel[] {
    const cardDatas = this.getCardDatas();
    if (!values || values.length === 0) {
      return this.getSortedCardDatas(cardDatas);
    }
    const filterCards = cardDatas.filter(card => values.includes(card.tag));
    return this.getSortedCardDatas(filterCards);
  }

  getSortedCardDatas(sortingCards: CardDataModel[]): CardDataModel[] {
    if (this.sortingValue) {
      sortingCards.sort((x, y) => x.title.localeCompare(y.title));
      if (this.sortingValue === 'Descending') {
        sortingCards.reverse();
      }
    }
    return sortingCards;
  }

  onSearch(event: any): void {
    const value = event.target.value;
    if (value) {
      this.cardDatas = this.cardDatas.filter(e =>
        e.title.toLowerCase().includes(value.toLowerCase()) ||
        e.subTitle.toLowerCase().includes(value.toLowerCase()) ||
        e.content.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.cardDatas = this.getCardDatasByFilter(this.filteringValue);
    }
  }

  onSorting(event: any): void {
    this.sortingValue = event.target.value;
    this.cardDatas = this.getSortedCardDatas(this.cardDatas);
  }

  onFiltering(event: any): void {
    this.filteringValue = Array.from(event.target.selectedOptions, (option: any) => option.value);
    this.cardDatas = this.getCardDatasByFilter(this.filteringValue);
  }

  onReset(): void {
    this.searchValue = '';
    this.sortingValue = '';
    this.filteringValue = [];
    this.cardDatas = this.getCardDatas();
  }
}

interface CardDataModel {
  title: string;
  subTitle: string;
  content: string;
  navUrl: string;
  tag: string;
}
