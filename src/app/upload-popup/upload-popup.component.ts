import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-popup',
  templateUrl: './upload-popup.component.html',
  styleUrls: ['./upload-popup.component.css']
})
export class UploadPopupComponent {


constructor(private dialogRef: MatDialogRef<UploadPopupComponent>, private router: Router,
  @Inject(MAT_DIALOG_DATA) public dialogData: any,){}


// uploadScreen(){
//   this.router.navigate(['/entity-screen']);
// }
uploadScreen(){
  this.router.navigate(['/entity-screen'])
  this.dialogRef.close();
}

entityUpload(){
  this.router.navigate(['/entity-upload-screen'])
  this.dialogRef.close();
}
  closepopup() {
    this.dialogRef.close();
    window.location.reload();
  }

  closeDialog(){
    this.dialogRef.close();
    window.location.reload()
  }
}
