import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss']
})
export class OthersComponent implements OnInit {

  @Input() others: FormGroup;
  public userData: any;

  constructor(private sharedService:SharedService) { }

  ngOnInit(): void {
  }

  handleInputChange(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
}
