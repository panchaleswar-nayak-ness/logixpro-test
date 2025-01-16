import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-storage-container-management',
  templateUrl: './storage-container-management.component.html',
  styleUrls: ['./storage-container-management.component.scss']
})
export class StorageContainerManagementModalComponent implements OnInit {

  scm = {
    zone: "",
    carousel: "",
    shelf: "",
    tray: "",
    containertype:""
  }
  errorText: string = "Storage Container/Tray cannot exceed 5 characters. Please enter a valid value.";

  containerTypes: string []= ["Whole","Half Shortways","Half Longways","Quartered","Octa-divided"];

  constructor() { }

  ngOnInit(): void {
  }

}
