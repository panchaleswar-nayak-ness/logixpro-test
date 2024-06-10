import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ToteDataResponse } from '../models/markout-model';

class info {
  title: string;
  value: string;
  colorClass: string;
}
@Component({
  selector: 'app-markout-status',
  templateUrl: './markout-status.component.html',
  styleUrls: ['./markout-status.component.scss'],
})
export class MarkoutStatusComponent implements OnInit {
  info: info[] = [
    { title: 'Status', value: '-', colorClass: 'label-gray' },
    { title: 'Missed', value: '0', colorClass: 'Reprocess-card' },
    { title: 'Short', value: '0', colorClass: 'Open-card' },
    { title: 'Ship Short', value: '0', colorClass: 'label-blue2' },
    { title: 'Complete', value: '0', colorClass: 'Compete-cart' },
  ];

  @Input() toteDataResponse: ToteDataResponse;
  isBlossomed : boolean = false;

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['toteDataResponse'] &&
      changes['toteDataResponse']['currentValue']
    ) {
      this.info[0].value = this.toteDataResponse.toteStatus == ""? "-" : this.toteDataResponse.toteStatus; 
      this.info[3].value = this.toteDataResponse.data
        .filter((element) => (element.status == 'Ship Short'))
        .length.toString();
      this.info[2].value = this.toteDataResponse.data
        .filter((element) => (element.status == 'Short'))
        .length.toString();
      this.info[4].value = this.toteDataResponse.data
        .filter((element) => (element.status == 'Complete'))
        .length.toString();
      this.info[1].value = this.toteDataResponse.data
        .filter((element) => (element.status == 'Missed'))
        .length.toString();
        this.isBlossomed = this.toteDataResponse.blossomCount > 0;
    }
  }
}
