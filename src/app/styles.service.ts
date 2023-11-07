import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StylesService {
  private themeElement: HTMLLinkElement;

  constructor() {
    this.themeElement = document.getElementById('theme') as HTMLLinkElement;
  }

  setStylesheet(url: string): void {
    this.themeElement.href = url;
  }
}