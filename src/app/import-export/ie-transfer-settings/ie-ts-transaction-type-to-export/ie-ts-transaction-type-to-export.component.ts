import { Component, OnInit } from '@angular/core';

interface Actions {
  title: string;
}

@Component({
  selector: 'app-ie-ts-transaction-type-to-export',
  templateUrl: './ie-ts-transaction-type-to-export.component.html',
  styleUrls: ['./ie-ts-transaction-type-to-export.component.scss']
})
export class IeTsTransactionTypeToExportComponent implements OnInit {

  actionBtnListOne : Actions[] = [
    { title: "Hot Picks" },
    { title: "Adjustments" },
    { title: "Hot Put Aways" },
    { title: "Moves" },
    { title: "Complete" },
    { title: "Shipping Complete" },
    { title: "Shipping" }
  ]
  
  actionBtnListTwo : Actions[] = [
    { title: "Shipping Transactions" },
    { title: "Wait for Split Transactions" },
    { title: "Recombine Split Transactions" },
    { title: "Hold Pick Until Ship Complete" },
    { title: "Hold Pick Until Tote Complete" },
    { title: "Hold Pick Until Order Complete" }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
