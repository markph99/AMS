import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersSchedule } from '../models/users-schedule';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  // localhost url for the database 
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  // querying a schedule
  getUser(): Observable<UsersSchedule[]> {
    return this.http.get<UsersSchedule[]>(this.baseUrl);
  }

  // adding an schedule
  addUser(newSchedule: UsersSchedule): Observable<UsersSchedule[]> {
    return this.http.post<UsersSchedule[]>(this.baseUrl, newSchedule);
  }
}
