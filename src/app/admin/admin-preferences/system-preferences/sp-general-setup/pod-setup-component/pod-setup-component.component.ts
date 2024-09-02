
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralSetup } from 'src/app/common/Model/preferences';
import { OSFieldFilterNames } from 'src/app/common/types/CommonTypes';

@Component({
  selector: 'app-pod-setup-component',
  templateUrl: './pod-setup-component.component.html',
  styleUrls: []
})
export class PodSetupComponentComponent{
  @Input() fieldNames: OSFieldFilterNames;
  @Input() podSetup: GeneralSetup;
  @Output() updatesPodSetup = new EventEmitter<GeneralSetup>();

  update(){ 
    this.updatesPodSetup.emit(this.podSetup);    
  }

}
