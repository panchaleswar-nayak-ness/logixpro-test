import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BatchTotesTableResponse } from 'src/app/induction-manager/process-put-aways/process-put-aways.component';



@Injectable({
  providedIn: 'root'
})
export class DialogCommunicationService {
  // Subject for batch updates
  private readonly batchUpdateSource = new Subject<string>();
  batchUpdate$: Observable<string> = this.batchUpdateSource.asObservable();
  
  // Subject for zone updates
  private readonly zoneUpdateSource = new Subject<string>();
  zoneUpdate$: Observable<string> = this.zoneUpdateSource.asObservable();

  // Subject for totes updates
  private readonly totesUpdateSource = new Subject<BatchTotesTableResponse[]>();
  totesUpdate$: Observable<BatchTotesTableResponse[]> = this.totesUpdateSource.asObservable();
  
  constructor() { }
  
  // Methods to emit updates
  updateBatch(batchId: string): void {
    this.batchUpdateSource.next(batchId);
  }
  
  updateZones(zones: string): void {
    this.zoneUpdateSource.next(zones);
  }

  updateTotes(totes: BatchTotesTableResponse[]): void {
    this.totesUpdateSource.next(totes);
  }
}

