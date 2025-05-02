
import { Injectable } from '@angular/core';
import { ILocalStorageCache } from './localstorage-cache-interface';

@Injectable({
  providedIn: 'root'
})


export class LocalStorageCache<T> implements ILocalStorageCache<T> {
    
    private localStorageKey: string;

    constructor() {
     }

    init(storageKey: string) {
        this.localStorageKey = storageKey;
    }

    // Method to get data from local storage
    getData(): T {
        const data = localStorage.getItem(this.localStorageKey);
        return data ? JSON.parse(data) : null;
    }

    // Method to set data in local storage
    setData(data: T): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    }

    // Method to clear data from local storage
    clearData(): void {
        localStorage.removeItem(this.localStorageKey);
    }

}