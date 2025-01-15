import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/common/constants/menu.constants';

@Component({
  selector: 'app-cycle-counts',
  templateUrl: './cycle-counts.component.html',
  styleUrls: []
})
export class CycleCountsComponent {

  constructor(private router: Router) { }
  createTransaction(){
    this.router.navigate([AppRoutes.AdminCreateCountBatches]);  
  }

}
