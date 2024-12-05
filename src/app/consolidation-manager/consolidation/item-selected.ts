import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "angular-routing";
import { AuthService } from "src/app/common/init/auth.service";
import { Component, Inject, OnInit } from "@angular/core";
import { IConsolidationApi } from "src/app/common/services/consolidation-api/consolidation-api-interface";
import { ConsolidationApiService } from "src/app/common/services/consolidation-api/consolidation-api.service";
import { GlobalService } from "src/app/common/services/global.service";
import {  Column ,ToasterTitle,ToasterType,ColumnDef,UniqueConstants, Placeholders} from 'src/app/common/constants/strings.constants';

@Component({
    template: ''
})

export class ItemSelected implements OnInit {

    placeholders = Placeholders;
    public startSelectFilter: any;
    public itemSelectTable: any;
    public tabledata1: any;
    public tabledata2: any;

    public IdentModal:any;
    public ColLabel:any;

    userData: any;

    fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
    filterOptionarr :any= [
        {key: '1', value: Column.ItemNumber},
        {key: '2', value: 'Supplier Item ID'},
        {key: '10', value: Column.LotNumber},
        {key: '8', value: ColumnDef.SerialNumber},
        {key: '9', value: this.fieldMappings?.userField1 || this.placeholders.userField1Fallback},
        {key: '0', value: 'Any Code'},
        {key: '6', value: Column.ToteID},
      ];

      public IconsolidationAPI : IConsolidationApi;

      constructor(
        public consolidationAPI : ConsolidationApiService,
        private global:GlobalService, 
        
        private router: Router,   
        private authService: AuthService,
        @Inject(MAT_DIALOG_DATA) public data: any) { this.IconsolidationAPI = consolidationAPI; }

    ngOnInit(): void {
        
        this.userData = this.authService.userData();
        this.IdentModal = this.data.IdentModal; 
        this.ColLabel = this.filterOption[this.data.ColLabel].value

        this.getItemSelectedData();
        

    }

    getItemSelectedData(){
        let payload = {
            UniqueConstants.OrderNumber: this.IdentModal ,
            "column": this.ColLabel,
            "columnValue": this.data.ColLabel
        }

        this.IconsolidationAPI.ItemModelData(payload).subscribe((res=>{
            if (res.isExecuted && res) {
                this.itemSelectTable = res;
              }
              else {
                this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
                console.log("ItemModelData",res.responseMessage);
              }
            }));
    }

    filterOption() {
        if (this.startSelectFilter == '2') {
            this.startSelectFilter = 1;
        }
        else {
            this.startSelectFilter = 2;
        }
    }

    clickOnItemSelect() {
         this.itemSelectTable().forEach((row) => { 
            let id = row.id;

            let payload = {
                "id": id
            }
            this.IconsolidationAPI.VerifyItemPost(payload).subscribe((res: any) => {
                if (!res.isExecuted) {
                    this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
                    console.log("VerifyItemPost",res.responseMessage);

                }

                else {
                    this.tabledata1.forEach((row, i) => { 

                        let tabID = row.id;
                        if (tabID == id) {
                            this.tabledata2 = this.tabledata1.splice(i, 1);
                        }
                    });


                }

            })


        })
    }

    verifyAll(){
        this.itemSelectTable.forEach((row) => {
                let id = row.id;
                let payload = {
                    "id": id
                }

                this.IconsolidationAPI.VerifyItemPost(payload).subscribe((res: any) => {
                    if (!res.isExecuted) {
                        this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
                        console.log("VerifyItemPost",res.responseMessage);

                    }

                    else {
                        this.tabledata1.forEach((row :any, i) => { 

                            let tabID = row.id;
                            if (tabID == id) {
                                this.tabledata2 = this.tabledata1.splice(i, 1);
                            }
                        });
                    }
                })
        });
    }

}

