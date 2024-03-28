import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';

@Component({
  selector: 'app-upload-status-dialog',
  templateUrl: './upload-status-dialog.component.html',
  styleUrls: ['./upload-status-dialog.component.css']
})
export class UploadStatusDialogComponent implements OnInit {
 
  show = false;
  PopupShown: any | null;
  uploadStatus: any | null;
  entitymessage: any | null;

  constructor(
    private router: Router,private entityservice:EntityScreenServiceService
  ) {
    // this.uploadStatus = sessionStorage.getItem('uploadStatus');
    console.log(this.uploadStatus);
   }

  ngOnInit(){
    // this.uploadStatus = sessionStorage.getItem('uploadStatus');
    console.log(this.uploadStatus);
  }
  openDialog() {
    this.uploadStatus = sessionStorage.getItem('uploadStatus');
    this.entitymessage =  sessionStorage.getItem('entityuploadMessage');
    console.log('its hitting openDialog');
    console.log(this.uploadStatus);
      this.show = true;
  }
  
  closeDialog() {
      this.show = false;
      this.entityservice.refresh()
      // window.location.reload();
  }

}
