import { Injectable } from '@angular/core';

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
    public ORDER_MANAGER = "Order Manager";
    public ClearAllItems() {
      this.savedItem = [];
    }
    public ClearItemsExceptCurrentTab(currentTab: string) {
      this.SetNull(this.BATCH_MANAGER, currentTab);
      this.SetNull(this.BATCH_MANAGER_DELETE, currentTab);
      this.SetNull(this.INVENTORY, currentTab);      
      this.SetNull(this.INVENTORY_MAP, currentTab);      
      this.SetNull(this.TRANSACTIONS, currentTab);
      this.SetNull(this.TRANSACTIONS_ORDER, currentTab);    
      this.SetNull(this.TRANSACTIONS_ORDER_SELECT, currentTab);     
      this.SetNull(this.CONSOLIDATION, currentTab);          
      this.SetNull(this.ORDER_MANAGER, currentTab);      
    }
    public SetNull (currentTab: string, excludeTab: string) {
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
        console.log("MultiTabs | Returned to Dashboard: "+'selectedTab_'+currentTab);
        console.log("MultiTabs | Removed: "+previousTab);
        this.RemoveTabOnRoute(previousTab);
        this.setPreviousUrl('selectedTab_'+currentTab);
        return false; // No redirect to dashboard.
      }
      else if (currentTab !== previousTab) {
        console.log("MultiTabs | Removed: "+previousTab);
        this.RemoveTabOnRoute(previousTab);
        console.log("MultiTabs | Set: "+'selectedTab_'+currentTab);
        localStorage.setItem('selectedTab_'+currentTab, currentTab);	
      }
      return true;
    }
    public RemoveTabOnRoute(currentTab:string) {
      if (currentTab.indexOf("Dashboard") >= 0 || currentTab.indexOf("dashboard") >= 0) return;
      console.log("MultiTabs | Removed: "+'selectedTab_'+currentTab);
      localStorage.removeItem('selectedTab_'+currentTab);
    }
    private previousUrl: string | null = null;

    setPreviousUrl(url: string) {
      if (url.indexOf("Dashboard") >= 0 || url.indexOf("dashboard") >= 0) return;
      console.log("MultiTabs | Set PreviousURL: "+url);
      this.previousUrl = url;
    }

    getPreviousUrl(): string | null {
      return this.previousUrl;
    }
}