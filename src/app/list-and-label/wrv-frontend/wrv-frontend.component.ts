import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';
import { environment } from 'src/environments/environment';
import {  TableConstant ,UniqueConstants} from 'src/app/common/constants/strings.constants';
import { BaseService } from 'src/app/common/services/base-service.service';

@Component({
  selector: 'app-wrv-frontend',
  templateUrl: './wrv-frontend.component.html',
  styleUrls: ['./wrv-frontend.component.scss']
})
export class WrvFrontendComponent implements OnInit {
  @ViewChild('ListAndLabel', { static: true }) ListAndLabel: ElementRef;
  FileName:any = "";
  constructor(private sharedService:SharedService,private route:ActivatedRoute, private baseService: BaseService) {
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
    let apiUrlObservable = this.baseService.GetApiUrl();
    apiUrlObservable.subscribe((url: any) => {
      let backendUrl = url.split("/api")[0];
      const dynamicHtml = `<ll-webreportviewer backendUrl="${backendUrl}/LLWebReportViewer"
      defaultProject="${this.FileName.split('-')[1] == UniqueConstants.Ibl|| this.FileName?.toLowerCase()?.indexOf(TableConstant.label)>-1 ? 'BCAEC8B2-9D16-4ACD-94EC-74932157BF82':'072A40E4-6D25-47E5-A71F-C491BC758BC9'}" customData="${this.FileName}" ></ll-webreportviewer>`; 
      this.ListAndLabel.nativeElement.insertAdjacentHTML('beforeend', dynamicHtml);
    });

  }
  ngOnDestroy(){ 
    alert('123213')
    this.sharedService.SideBarMenu.next(true);
    this.sharedService.updateLoadMenuFunction({route:localStorage?.getItem('reportNav'),isBackFromReport:true})
    window.location.reload();
  }

} 