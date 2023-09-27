import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wrv-frontend',
  templateUrl: './wrv-frontend.component.html',
  styleUrls: ['./wrv-frontend.component.scss']
})
export class WrvFrontendComponent implements OnInit {
  @ViewChild('ListAndLabel', { static: true }) ListAndLabel: ElementRef;
  FileName:any = "";
  constructor(private sharedService:SharedService,private route:ActivatedRoute) {
    this.sharedService.SideBarMenu.next(false);
    this.sharedService.updateMenuState(true)
  }
  ngOnInit(): void {
    this.sharedService.updateLoadMenuFunction({route:localStorage?.getItem('reportNav'),isBackFromReport:false})
    let filename = this.route.queryParamMap.pipe(
      map((params: ParamMap) => params.get('file')),
    );
    filename.subscribe((param) => { 
      if (param!=null &&param != undefined) {
        this.FileName = param;
      } 
    });
    setTimeout(() => {
      if(this.FileName != null) this.generateHTMLAndAppend();
    }, 600);
  }

  generateHTMLAndAppend() { 
    const dynamicHtml = `<ll-webreportviewer backendUrl="${environment.apiUrl.split("/api")[0]}/LLWebReportViewer"
    defaultProject="${this.FileName.split('-')[1] == 'lbl'|| this.FileName?.toLowerCase()?.indexOf('label')>-1 ? 'BCAEC8B2-9D16-4ACD-94EC-74932157BF82':'072A40E4-6D25-47E5-A71F-C491BC758BC9'}" customData="${this.FileName}" ></ll-webreportviewer>`; 
    this.ListAndLabel.nativeElement.insertAdjacentHTML('beforeend', dynamicHtml);
  }
  ngOnDestroy(){ 
    alert('123213')
    this.sharedService.SideBarMenu.next(true);
    this.sharedService.updateLoadMenuFunction({route:localStorage?.getItem('reportNav'),isBackFromReport:true})
    window.location.reload();
  }

} 