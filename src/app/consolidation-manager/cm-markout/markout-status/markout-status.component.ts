import { Component, Input, OnInit, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { ToteDataResponse } from '../models/markout-model';
import { CmPreferences } from 'src/app/common/types/CommonTypes';

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
    { title: 'Current Status', value: '-', colorClass: 'label-gray' },
    { title: 'Missed', value: '0', colorClass: 'Reprocess-card' },
    { title: 'Short', value: '0', colorClass: 'Open-card' },
    { title: 'Ship Short', value: '0', colorClass: 'label-blue2' },
    { title: 'Complete', value: '0', colorClass: 'Compete-cart' },
    { title: 'Not Inducted', value: '0', colorClass: 'not-inducted-status' }
  ];

  @Input() toteDataResponse: ToteDataResponse;
  @Input() markoutPreference: CmPreferences;

  isBlossomed: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['toteDataResponse'] &&
      changes['toteDataResponse']['currentValue']
    ) {
      this.info[0].value = this.toteDataResponse.toteStatus == "" ? "-" : this.toteDataResponse.toteStatus;
      this.info[3].value = this.toteDataResponse.data
        .filter((element) => element.status == 'Ship Short')
        .length.toString();
      this.info[2].value = this.toteDataResponse.data
        .filter((element) => element.status == 'Short')
        .length.toString();
      this.info[4].value = this.toteDataResponse.data
        .filter((element) => element.status == 'Complete')
        .length.toString();
      this.info[1].value = this.toteDataResponse.data
        .filter((element) => element.status == 'Missed')
        .length.toString();
      this.info[5].value = this.toteDataResponse.data
        .filter((element) => element.status == 'Not Inducted')
        .length.toString();
      this.isBlossomed = this.toteDataResponse.blossomCount > 0;
    }


      let elements: NodeListOf<Element>[] = [];
    
      if (this.markoutPreference?.missed === true) {
        elements.push(this.el.nativeElement.querySelectorAll('app-info-card-component mat-card.Reprocess-card'));
      }
      if (this.markoutPreference?.short === true) {
        elements.push(this.el.nativeElement.querySelectorAll('app-info-card-component mat-card.Open-card'));
      }
      if (this.markoutPreference?.complete === true) {
        elements.push(this.el.nativeElement.querySelectorAll('app-info-card-component mat-card.Compete-cart'));
      }
      if (this.markoutPreference?.notIncluded === true) {
        elements.push(this.el.nativeElement.querySelectorAll('app-info-card-component mat-card.not-inducted-status'));
      }
      if (this.markoutPreference?.shipShort === true) {
        elements.push(this.el.nativeElement.querySelectorAll('app-info-card-component mat-card.label-blue2'));
      }
    
      // Apply styles to all selected elements
      elements.forEach(nodeList => {
        nodeList.forEach(element => {
          this.renderer.setStyle(element, 'box-shadow', 'inset 0 0 0 4px #1A1AD3');
        });
      });
 
    console.log(this.markoutPreference.missed);
    console.log(this.markoutPreference.short);
    console.log(this.markoutPreference.shipShort);
  }
}
