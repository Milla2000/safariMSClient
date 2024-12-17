// toast.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit {
  showToast = false;
  toastMessage = '';

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState.subscribe((message: string) => {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    });
  }
}
