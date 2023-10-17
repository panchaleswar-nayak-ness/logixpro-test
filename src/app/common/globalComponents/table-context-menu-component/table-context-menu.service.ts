import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableContextMenuService{
  
    event : MouseEvent;
    SelectedItem : any;
    FilterColumnName? : any;
    FilterConditon? : any;
    FilterItemType? : any;
    contextMenuObserver : Subject<boolean> = new Subject<boolean>(); // observing that bool
    
    constructor() { }

    updateContextMenuState(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) { 
        this.event = event;
        this.SelectedItem = SelectedItem;
        this.FilterColumnName = FilterColumnName;
        this.FilterConditon = FilterConditon;
        this.FilterItemType = FilterItemType;
        this.contextMenuObserver.next(true); 
    }

}
