import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { STORAGE_KEY } from '../constants/storage-key';

@Injectable({
  providedIn: 'root'
})
export class SpreadSheetsService {

  constructor(private readonly http: HttpClient) {
  }

  createSheet(ranging: number[]) {
    // const d = new Date();
    // const date = d.toISOString().slice(0, 10);
    // const time = `${d.getHours()} : ${d.getMinutes()}`
    // return this.http.post<any>(`${environment.CONNECTION_URL}`, {
    //   date,
    //   time,
    //   ranging
    // }).pipe(
    //   tap(() => {
    //     localStorage.setItem(STORAGE_KEY, 'true');
    //   })
    // );
    localStorage.setItem(STORAGE_KEY, 'true');
  }
}
