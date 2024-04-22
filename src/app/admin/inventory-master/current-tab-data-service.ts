import { Injectable } from '@angular/core';
import {  AppPermissions } from 'src/app/common/constants/menu.constants';

@Injectable({
  providedIn: 'root'
})
export class CurrentTabDataService {
    public currentTab: string;
    public savedItem: string[] = [];
    public BATCH_MANAGER = "Batch Manager";
    public BATCH_MANAGER_DELETE = "Batch Manager Delete";
    public INVENTORY_MAP = "Inventory Map";
    public INVENTORY = "Inventory";
    public TRANSACTIONS = "Transactions";
    public TRANSACTIONS_ORDER = "Transactions Order";
    public TRANSACTIONS_ORDER_SELECT = "Transactions Order Select";
    public CONSOLIDATION = "Consolidation";
    public ORDER_MANAGER = AppPermissions.OrderManager;
    
    public ClearAllItems() {
      this.savedItem = [];
    }

    public ClearItemsExceptCurrentTab() {
      this.SetNull(this.BATCH_MANAGER);
      this.SetNull(this.BATCH_MANAGER_DELETE);
      this.SetNull(this.INVENTORY);      
      this.SetNull(this.INVENTORY_MAP);      
      this.SetNull(this.TRANSACTIONS);
      this.SetNull(this.TRANSACTIONS_ORDER);    
      this.SetNull(this.TRANSACTIONS_ORDER_SELECT);     
      this.SetNull(this.CONSOLIDATION);          
      this.SetNull(this.ORDER_MANAGER);      
    }
    
    public SetNull (currentTab: string) {
      this.savedItem[currentTab] = undefined;
    }

    public CheckTabOnRoute(currentTab: string, previousTab: string) {
      if (currentTab.indexOf("Dashboard") >= 0 || currentTab.indexOf("dashboard") >= 0) return true;

      if ((currentTab.split("/").length - 1) != 2) {
        this.RemoveTabOnRoute(previousTab);
        this.setPreviousUrl('selectedTab_'+currentTab);
        return true;
      }

      if (localStorage.getItem('selectedTab_'+currentTab) != null) {
        this.RemoveTabOnRoute(previousTab);
        this.setPreviousUrl('selectedTab_'+currentTab);
        return true; // No redirect to dashboard.
      }
      else if (currentTab !== previousTab) {
        this.RemoveTabOnRoute(previousTab);
        localStorage.setItem('selectedTab_'+currentTab, currentTab);	
      }
      return true;
    }

    public RemoveTabOnRoute(currentTab:string) {
      if (currentTab.indexOf("Dashboard") >= 0 || currentTab.indexOf("dashboard") >= 0) return;
      localStorage.removeItem('selectedTab_'+currentTab);
    }

    private previousUrl: string | null = null;

    setPreviousUrl(url: string) {
      if (url.indexOf("Dashboard") >= 0 || url.indexOf("dashboard") >= 0) return;
      this.previousUrl = url;
    }

    getPreviousUrl(): string | null {
      return this.previousUrl;
    }
}