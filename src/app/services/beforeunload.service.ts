import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeforeunloadService {


   // Method to subscribe to the beforeunload event
   beforeUnloadEvent(): Observable<BeforeUnloadEvent> {
    return new Observable((observer) => {
      const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = ''; // This is necessary for modern browsers
        observer.next(event);
      };

      window.addEventListener('beforeunload', beforeUnloadHandler);

      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    });
  }
}
