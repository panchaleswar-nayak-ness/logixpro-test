import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssignService {

  private data:string[] = [];

  removeGroupOption(data: string[], value: string) {
    
   return data.filter((v:string) => v !== value)

  }
  addGroupOption(data: string[], value: string){

    return data.push(value);
  }

}
