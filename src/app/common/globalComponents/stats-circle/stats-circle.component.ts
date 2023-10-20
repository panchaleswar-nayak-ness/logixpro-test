import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats-circle',
  templateUrl: './stats-circle.component.html',
  styleUrls: ['./stats-circle.component.scss']
})
export class StatsCircleComponent implements OnInit {

  @Input() value = "";
  @Input() title = "";

  constructor() { }

  ngOnInit(): void {
  }

}
