import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersSchedule } from '../models/users-schedule';

@Injectable({
  providedIn: 'root',
})
export class SchedulingService {
  // Base URL for the database
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  // Querying schedules
  getUser(filterQuery: string = ''): Observable<UsersSchedule[]> {
    let params = new HttpParams();
    if (filterQuery.trim()) {
      params = params.set('query', filterQuery); // Add filter query to parameters
    }
    return this.http.get<UsersSchedule[]>(this.baseUrl, { params });
  }

  // Adding a schedule
  addUser(newSchedule: UsersSchedule): Observable<UsersSchedule> {
    return this.http.post<UsersSchedule>(this.baseUrl, newSchedule);
  }

  // Editing an existing schedule
  updateUser(id: number, updatedSchedule: UsersSchedule): Observable<UsersSchedule> {
    return this.http.put<UsersSchedule>(`${this.baseUrl}/${id}`, updatedSchedule);
  }

  // Deleting a schedule
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
