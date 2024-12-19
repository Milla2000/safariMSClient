// toast.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastSubject = new Subject<string>();
  toastState = this.toastSubject.asObservable();
  static readonly showToast: any;

  showToast(message: string): void {
    this.toastSubject.next(message);
  }
}
