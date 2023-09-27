import { Component, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: []
})
export class OthersComponent{

  @Input() others: FormGroup;
  public userData: any;

  constructor(private sharedService:SharedService) { }

 
  handleInputChange(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
}
