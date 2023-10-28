import { Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-weight-scale',
  templateUrl: './weight-scale.component.html',
  styleUrls: []
})
export class WeightScaleComponent {

  @Input() weighScale:  FormGroup;
  public userData: any;

  constructor(private sharedService:SharedService,) { }

 

  handleInputChange(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
}
