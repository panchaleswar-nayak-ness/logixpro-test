import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-count-batches',
  templateUrl: './create-count-batches.component.html',
  styleUrls: [],
})
export class CreateCountBatchesComponent implements OnInit{
  private paramSubscription: Subscription;
  countQueValue: any = 0;
  selectedIndex: number = 0;
  updateQueue: any;
  updateCreateCount: any;
  event: Event;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.paramSubscription = this.route.queryParams.subscribe(params => {
      const index = params['selectedIndex'];
      this.selectedIndex = index ? +index : 0; // Default to 0 if missing or invalid
      console.log('Received selectedIndex:', this.selectedIndex);
    });    
  }

  getCount(value) {
 
    this.countQueValue = value;
  }
  insertQueEvnt(e) {
    this.selectedIndex =0;
  }
  public nextStep(e) {
    this.selectedIndex += 1;
    this.updateQueue = e;
  }
  onChange(event: Event) {
    this.event = event;
  }
  tabChanged({ index }) {
    this.selectedIndex = index;
    if (index === 0) {
      this.updateCreateCount = true;
    } else {
      this.updateCreateCount = false;
    }
  }
}
