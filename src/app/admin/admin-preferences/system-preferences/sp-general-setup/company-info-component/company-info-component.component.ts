import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralSetup } from 'src/app/common/Model/preferences';

@Component({
  selector: 'app-company-info-component',
  templateUrl: './company-info-component.component.html',
  styleUrls: []
})
export class CompanyInfoComponentComponent{
  @Input() companyInfo: GeneralSetup;
  @Output() updateInfo = new EventEmitter<GeneralSetup>();

  update(){ 
    this.updateInfo.emit(this.companyInfo);    
  }
}
