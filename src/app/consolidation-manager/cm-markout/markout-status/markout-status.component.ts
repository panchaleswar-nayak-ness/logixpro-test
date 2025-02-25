import { Component, Input, OnInit, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import { ToteDataResponse } from '../models/markout-model';
import { CmPreferences } from 'src/app/common/types/CommonTypes';

class info {
  title: string;
  value: number | string;
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
    { title: 'Missed', value: 0, colorClass: 'Reprocess-card' },
    { title: 'Short', value: 0, colorClass: 'Open-card' },
    { title: 'Ship Short', value: 0, colorClass: 'label-blue2' },
    { title: 'Complete', value: 0, colorClass: 'Compete-cart' },
    { title: 'Not Inducted', value: 0, colorClass: 'not-inducted-status' }
  ];

  isGreaterThanZero(value: any): boolean {
    return Number(value) > 0;
  }

  @Input() toteDataResponse: ToteDataResponse;
  @Input() markoutPreference: CmPreferences;

  isBlossomed: boolean = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['toteDataResponse']?.currentValue) {
      this.updateInfoValues();
      this.updateBoxShadow();
    }
  }
  
  private updateInfoValues() {
    const data = this.toteDataResponse.data;
    
    this.info[0].value = this.toteDataResponse.toteStatus || "-";
    this.info[1].value = data.filter((el) => el.status === 'Missed').length;
    this.info[2].value = data.filter((el) => el.status === 'Short').length;
    this.info[3].value = data.filter((el) => el.status === 'Ship Short').length;
    this.info[4].value = data.filter((el) => el.status === 'Complete').length;
    this.info[5].value = data.filter((el) => el.status === 'Not Inducted').length;
  
    this.isBlossomed = this.toteDataResponse.blossomCount > 0;
  }
  
  private updateBoxShadow() {
    const statusMap = [
      { key: 'missed', index: 1, selector: '.Reprocess-card' },
      { key: 'short', index: 2, selector: '.Open-card' },
      { key: 'complete', index: 4, selector: '.Compete-cart' },
      { key: 'notIncluded', index: 5, selector: '.not-inducted-status' },
      { key: 'shipShort', index: 3, selector: '.label-blue2' }
    ];
  
    statusMap.forEach(({ key, index, selector }) => {
      const elements = this.el.nativeElement.querySelectorAll(`app-info-card-component mat-card${selector}`);
      elements.forEach((element: Element) => {
        if (this.markoutPreference?.[key] && Number(this.info[index]?.value) > 0) {
          this.renderer.setStyle(element, 'box-shadow', 'inset 0 0 0 4px #1A1AD3');
        } else {
          this.renderer.removeStyle(element, 'box-shadow');
        }
      });
    });
  }
  

}
