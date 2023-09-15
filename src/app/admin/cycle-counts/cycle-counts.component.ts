import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cycle-counts',
  templateUrl: './cycle-counts.component.html',
  styleUrls: ['./cycle-counts.component.scss']
})
export class CycleCountsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  createTransaction(){
    this.router.navigate(['/admin/createCountBatches']);
  }

}
