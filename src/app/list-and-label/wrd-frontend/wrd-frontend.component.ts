import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';
import { environment } from 'src/environments/environment';
import {  UniqueConstants } from 'src/app/common/constants/strings.constants';
import { AuthService } from 'src/app/common/init/auth.service';
import { BaseService } from 'src/app/common/services/base-service.service';

@Component({
  selector: 'app-wrd-frontend',
  templateUrl: './wrd-frontend.component.html',
  styleUrls: ['./wrd-frontend.component.scss']
})
export class WrdFrontendComponent implements OnInit {

  @ViewChild('ListAndLabel', { static: true }) ListAndLabel: ElementRef;

  fileName: string | null = "BMCountList";
  userCreated: string | null = "1";

  constructor(
    private sharedService:SharedService,
    private route:ActivatedRoute,
    public authService: AuthService,
    private baseService: BaseService
  ) {    
    this.sharedService.SideBarMenu.next(false);
    this.sharedService.updateMenuState(true);
  }

  ngOnDestroy(){ 
    this.sharedService.SideBarMenu.next(true);
    window.location.reload();
  }

  ngOnInit(): void {
    this.sharedService.updateLoadMenuFunction({route:'/admin/reports'});

     // Subscribe to the queryParamMap observable
     this.route.queryParamMap.pipe(
      map((params: ParamMap) => {
        // Extract individual parameters from the paramMap
        return {
          file: params.get('file'),
          userCreated: params.get('user'),
          // Add more parameters here if needed
        };
      })
    ).subscribe((params) => {
      // Assign the file parameter to fileName
      this.fileName = params.file;
      this.userCreated = params.userCreated
      // You can access other parameters in a similar way, e.g., params.parameterName
    });

    setTimeout(() => this.generateHTMLAndAppend(), 600);
  }

  generateHTMLAndAppend() { 

    // const dynamicHtml = `<ll-webreportdesigner backendUrl="${environment.apiUrl.split("/api")[0]}/LLWebReportDesigner"
    // defaultProject="${this.fileName.split('-')[1] == UniqueConstants.Ibl? 'BCAEC8B2-9D16-4ACD-94EC-74932157BF82':'072A40E4-6D25-47E5-A71F-C491BC758BC9'}" 
    // customData="${this.authService.userData().wsid+','+this.fileName}" ></ll-webreportdesigner>`; 
    // this.ListAndLabel.nativeElement.insertAdjacentHTML('beforeend', dynamicHtml);

    let apiUrlObservable = this.baseService.GetApiUrl();
    apiUrlObservable.subscribe((url: any) => {
      let backendUrl = url.split("/api")[0];
      const dynamicHtml = `<ll-webreportdesigner backendUrl="${backendUrl}/LLWebReportDesigner"
      defaultProject="${this.fileName?.split('-')[1] == UniqueConstants.Ibl ? 'BCAEC8B2-9D16-4ACD-94EC-74932157BF82':'072A40E4-6D25-47E5-A71F-C491BC758BC9'}" 
      customData="${ ((this.userCreated == "1") ? this.authService.userData().wsid : '') + ',' + this.fileName}" ></ll-webreportdesigner>`; 
      this.ListAndLabel.nativeElement.insertAdjacentHTML('beforeend', dynamicHtml);
    });
  }
} 