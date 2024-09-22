import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public static data: any = [];

  private dataSource: any = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#ba68c8',
          '#81c784',
          '#64b5f6',
          '#ffb74d',
          '#4bc0c0',
          '#9966ff',
        ],
      },
    ],
    labels: []
  };

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    if (DataService.data.length > 0) {
      for (var i = 0; i < DataService.data.length; i++) {
        this.dataSource.datasets[0].data[i] = DataService.data[i].budget;
        this.dataSource.labels[i] = DataService.data[i].title;
      }
      console.log(this.dataSource);
      return of(this.dataSource);
    } else {
      return this.http.get<any>('http://localhost:3000/budget').pipe(
        tap((res) => {
          DataService.data = res.myBudget;
        }),
        map((res) => {
          var budgetData = res.myBudget;
          for (var i = 0; i < budgetData.length; i++) {
            this.dataSource.datasets[0].data[i] = budgetData[i].budget;
            this.dataSource.labels[i] = budgetData[i].title;
          }
          return this.dataSource;
        })
      );
    }
  }
}
