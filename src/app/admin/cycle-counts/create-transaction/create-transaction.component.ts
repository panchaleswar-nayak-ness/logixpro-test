import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: []
})
export class CreateTransactionComponent implements OnInit, OnDestroy {
  private paramSubscription: Subscription;
  selectedIndex: number = 1;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(params => {
      this.selectedIndex = +params['selectedIndex'];
      console.log('Received selectedIndex:', this.selectedIndex);
    });
  }
  
  onTabChange(index: number): void {
    console.log("Tab changed to:", index);
    // Perform actions based on the index, such as updating the route or fetching data
  }
  
  ngOnDestroy() {
    this.paramSubscription.unsubscribe(); // Clean up the subscription
  }
}
