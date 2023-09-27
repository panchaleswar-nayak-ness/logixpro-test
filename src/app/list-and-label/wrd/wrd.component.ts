import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-wrd',
  templateUrl: './wrd.component.html',
  styleUrls: []
})
export class WrdComponent implements OnInit {
  env:string;
  file:string;
  @ViewChild('ListAndLabel', { static: true }) ListAndLabel: ElementRef;
  constructor(private route: ActivatedRoute) {
     
    this.env = location.protocol + '//' + location.host; 
 
   }
  ngOnInit(): void {
    let filename = this.route.queryParamMap.pipe(
      map((params: ParamMap) => params.get('file')),
    );
    filename.subscribe((param) => { 
      if (param!=null &&param != undefined) {
        this.file = param;
      } 
    });
    setTimeout(() => {
      this.generateHTMLAndAppend() ;
      
    }, 250);
  }
  generateHTMLAndAppend() { 
    const dynamicHtml = `
    <iframe style="width: 100%; height: 1000px;" id="wrdFrame" src="${this.env}/#/ListAndLabel/report?file=${this.file}">
    </iframe>
    `; 
    this.ListAndLabel.nativeElement.insertAdjacentHTML('beforeend', dynamicHtml);
  }
}
