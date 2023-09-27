import { Component, OnInit } from '@angular/core'; 
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-location-assignment',
  templateUrl: './location-assignment.component.html',
  styleUrls: []
})
export class LocationAssignmentComponent implements OnInit {

  countLabel:string = "Count (0)";
  pickLabel:string = "Pick (0)";
  putAwayLabel:string = "Put Away (0)";
  public userData: any;

  constructor(
    private Api: ApiFuntions,
    private authservice : AuthService,
  ) {}

  public Tab;

  ngOnInit(): void {
    this.userData = this.authservice.userData();
    this.getLabels();
  }

  getLabels(){
    let payload = {
      "userName" : this.userData.userName,
      "wsid": this.userData.wsid
    }
    this.Api.GetTransactionTypeCounts(payload).subscribe((res =>{
      if (res.isExecuted && res.data) {
        res.data.forEach(item => {
          if (item.transactionType === "Count") {
            this.countLabel = `Count (${item.count})`;
          } else if (item.transactionType === "Pick") {
            this.pickLabel = `Pick (${item.count})`;
          } else if (item.transactionType === "Put Away") {
            this.putAwayLabel = `Put Away (${item.count})`;
          }
        });
      } 
    }));
  }

  ngAfterViewInit(){
    // this.addItem()
  }

  addItem(newItem: Event) {
    this.Tab = newItem
  }
}
