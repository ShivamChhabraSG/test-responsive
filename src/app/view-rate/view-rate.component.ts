
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-rate',
  templateUrl: './view-rate.component.html',
  styleUrls: ['./view-rate.component.css']
})
export class ViewRateComponent implements OnInit {
  entityStatusName:any;
  unitName:any;
  rateType:any;
  rate:any;
  effectiveFromDate:any;
  mode:any=[];
  constructor(private route: Router,private actroute:ActivatedRoute) {}
  ngOnInit(): void {
    const data = JSON.parse(sessionStorage.getItem('UnitCodeRate') ?? 'null');
   
    this.entityStatusName = data.entityStatusName
    this.unitName=data.unitName;
    this.rateType=data.rateType;
    this.rate=data.rate;
    this.effectiveFromDate=data.effectiveFromDate 
    
    this.actroute.queryParamMap.subscribe((data: any) => {
      this.mode = data.params.mode;
 
    });
  }
  
  redirect() {
    this.route.navigate(['/interest-rate-screen']);
  }
}
