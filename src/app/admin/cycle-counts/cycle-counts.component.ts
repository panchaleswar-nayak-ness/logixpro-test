import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cycle-counts',
  templateUrl: './cycle-counts.component.html',
  styleUrls: []
})
export class CycleCountsComponent {

  constructor(private router: Router) { }
  createTransaction(){
    this.router.navigate(['/admin/createCountBatches']);
  }

}
