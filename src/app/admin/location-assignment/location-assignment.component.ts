import { Component, OnInit } from '@angular/core'; 
import { GlobalService } from 'src/app/common/services/global.service';
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
    private global : GlobalService
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
      else{
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("GetTransactionTypeCounts",res.responseMessage);
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
