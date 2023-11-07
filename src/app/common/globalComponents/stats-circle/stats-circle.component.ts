import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-circle',
  templateUrl: './stats-circle.component.html',
  styleUrls: ['./stats-circle.component.scss']
})
export class StatsCircleComponent {

  @Input() value = "";
  @Input() title = "";
  @Input() divClass = "div1";

}
