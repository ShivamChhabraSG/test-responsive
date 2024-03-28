import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ngbPositioning } from '@ng-bootstrap/ng-bootstrap/util/positioning';
// import { Tooltip, TooltipComponent, TooltipEventArgs  } from '@syncfusion/ej2-angular-popups';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-icon-arrow',
  templateUrl: './icon-arrow.component.html',
  styleUrls: ['./icon-arrow.component.css']
})
export class IconArrowComponent implements OnInit, ICellRendererAngularComp {

    cellValue: any;
    rowData: any;
    districtLevelList: any = [];
    isSelectedValue: any = [];
    newItems: any;
    value: any;
    currentQuestionIndex = 0;
    newArray: any;
    split: any;
    responseArray: any;
    newListItems: any;
    constructor() {
      
     }
    agInit(params: any): void {
      this.cellValue = params.value;
      this.rowData = params.data;
      //this.getDataFromApi(params);
    }
    refresh(params : any): boolean {
      throw new Error('Method not implemented.');
    }
  
    ngOnInit(): void {
      
    }
    getDataFromApi(){
      

        
  '<li class="tooltipRed">' + '<span class="tooltipRed">'  + '</span>' + '<li>'
  '<li class="tooltipBlue">'+'<span class="tooltipBlue">' + '</span>' + '<li>';
  
  this.newListItems = '<ul class = "contentStyle">'+this.districtLevelList  + '</ul>';
  console.log("dfdf" , this.newListItems)
       
     ;
    }
  
    // });
  
  
 
  }

