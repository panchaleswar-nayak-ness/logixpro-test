import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-weight-scale',
  templateUrl: './weight-scale.component.html',
  styleUrls: ['./weight-scale.component.scss']
})
export class WeightScaleComponent implements OnInit {

  @Input() weighScale:  FormGroup;
  public userData: any;

  constructor(private sharedService:SharedService,) { }

  ngOnInit(): void {
  }

  handleInputChange(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
}
