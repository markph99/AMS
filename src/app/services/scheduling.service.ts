import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersSchedule } from '../models/users-schedule';


@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUser(): Observable<UsersSchedule[]> {
    return this.http.get<UsersSchedule[]>(this.baseUrl);
  }

  addUser(newSchedule: UsersSchedule):Observable<UsersSchedule[]> {
    return this.http.get<UsersSchedule[]>(this.baseUrl);
  }

}
