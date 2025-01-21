import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../services/scheduling.service';
import { UsersSchedule } from '../models/users-schedule';

@Component({
  selector: 'app-work-scheduling',
  templateUrl: './work-scheduling.component.html',
  styleUrls: ['./work-scheduling.component.css'],
})
export class WorkSchedulingComponent implements OnInit {
  isLoading = false;
  hideLoading() {
    this.isLoading = false;
  }
  showLoading() {
    this.isLoading = true;
  }

  userSchedule: UsersSchedule[] = [];
  // models of work scheduling
  newSchedule: UsersSchedule = {
    name: '',
    branch: '',
    department: '',
    schedule_name: '',
    start_date: '',
    end_date: '',
  };

  constructor(private schedulingService: SchedulingService) {}

  ngOnInit(): void {
    // Automatically fetch updates every 10 seconds
    this.schedulingService.getUser().subscribe((data) => {
      this.userSchedule = data.sort((a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    });
  }

  // add new schedule
  onSubmit() {
    this.schedulingService.addUser(this.newSchedule).subscribe((user) => {
      this.userSchedule.push(this.newSchedule);
      this.newSchedule = {
        name: '',
        branch: '',
        department: '',
        schedule_name: '',
        start_date: '',
        end_date: '',
      };
    });
  }
}
