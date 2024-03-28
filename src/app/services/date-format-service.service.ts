import { Injectable } from '@angular/core';

import { ValueCache } from 'ag-grid-community';

import * as moment from 'moment';

import { Observable, Subject } from 'rxjs';



@Injectable({

  providedIn: 'root'

})

export class DateFormatServiceService {

  private subject = new Subject<any>();



  sendClickEvent() {

    this.subject.next;

    this.getClickEvent()



  }



  getClickEvent(): Observable<any> {

    return this.subject.asObservable();



  }





  private _listners = new Subject<any>();

  listen(): Observable<any> {

    return this._listners.asObservable();

  }

  filter(filterBy: string) {

    this._listners.next(filterBy)

  }



  dateformat(value: moment.MomentInput, requireddateFormat = 'DD MMM YYYY HH:mm:ss')



  // MMM D, YYYY'

  // DD-MMM-YY

  {

    return moment(value).format(requireddateFormat);


  }


  dateSanctionformat(value: moment.MomentInput, requireddateFormat = 'DD MMM YYYY')



  // MMM D, YYYY'

  // DD-MMM-YY

  {

    return moment(value).format(requireddateFormat);



  }

}