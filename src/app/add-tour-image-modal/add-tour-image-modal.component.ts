// add-tour-image-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-tour-image-modal',
  templateUrl: './add-tour-image-modal.component.html',
  styleUrls: ['./add-tour-image-modal.component.css']
})
export class AddTourImageModalComponent {
  imageUrl: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddTourImageModalComponent>
  ) {}

  onSubmit() {
    // Pass the image URL back to the parent component
    this.dialogRef.close(this.imageUrl);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
