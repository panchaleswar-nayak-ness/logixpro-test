import { Component, OnInit } from '@angular/core'; 
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

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
  public iAdminApiService: IAdminApiService;

  constructor(
    private Api: ApiFuntions,
    private adminApiService: AdminApiService,
    private authservice : AuthService,
  ) {
    this.iAdminApiService = adminApiService;
  }

  public Tab;

  ngOnInit(): void {
    this.userData = this.authservice.userData();
    this.getLabels();
  }

  getLabels(){
    let payload = {
    }
    this.iAdminApiService.GetTransactionTypeCounts(payload).subscribe((res =>{
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
