import { Component,ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { AddEntityServiceService } from '../services/add-entity-service.service';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { Router } from '@angular/router';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';

@Component({
  selector: 'app-warning-log-dialog',
  templateUrl: './warning-log-dialog.component.html',
  styleUrls: ['./warning-log-dialog.component.css']
})
export class WarningLogDialogComponent {
 
  @Output() rateEvent = new EventEmitter<string>();
  @Output() claimsEvent = new EventEmitter<string>();
  show = false;
  PopupShown: any | null;
  userId: any | null;
  unitCode: any | null;
  entityData: any | null;

  constructor(
    private addEntityService: AddEntityServiceService,
    private http: EntityScreenServiceService,
    private entityService: EntityScreenServiceService,
    private router: Router,
    private SharedEntityService: SharedEntityServiceService,
    private cd: ChangeDetectorRef
  ) { 
    // this.entityData = sessionStorage.getItem('entityData');
  }

  ngOnInit(){
    this.cd.detectChanges();
    //this.entityData = sessionStorage.getItem('entityData');
    console.log(this.entityData);
  }
  openDialog() {
    this.entityData = sessionStorage.getItem('entityData');
    console.log('its hitting openDialog');
    console.log(this.entityData);
      this.show = true;
  }
  
  closeDialog() {
      this.show = false;
      window.location.reload();
  }



  gobackUserScreen() {
    // this.router.navigate(['/add-user-data']);
    this.show = false;
  }


  EditEntity(){
    this.router.navigate(['/add-entity'] ,{queryParams:{mode : 'Edit'}});
  }

  EditUser(){
    sessionStorage.setItem('UserData', 'EditUser');
    this.router.navigate(['/add-user-data']);
  }

  DeleteUser() {
    sessionStorage.setItem('UserData', 'deleteData');
    this.router.navigate(['/add-user-data']);
  }

  EditRate(){
    this.rateEvent.emit();
  }

  EditClaimsProccesing(){
   this.claimsEvent.emit();
  }
}
