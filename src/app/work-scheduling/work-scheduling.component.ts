import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../services/scheduling.service';
import { UsersSchedule } from '../models/users-schedule';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-work-scheduling',
  templateUrl: './work-scheduling.component.html',
  styleUrls: ['./work-scheduling.component.css'],
})
export class WorkSchedulingComponent implements OnInit {
  isLoading = false;
  userSchedule: UsersSchedule[] = [];
  currentPage: number = 1;
  // Model for a new or edited schedule
  newSchedule: UsersSchedule = {
    name: '',
    branch: '',
    department: '',
    schedule_name: '',
    start_date: '',
    end_date: '',
  };
  isEditMode: boolean = false;
isSuccess: any;

  constructor(
    private schedulingService: SchedulingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchSchedules();
  }

  // Show loader
  showLoading() {
    this.isLoading = true;
  }

  // Hide loader
  hideLoading() {
    this.isLoading = false;
  }

  // Fetch all schedules
  fetchSchedules() {
    this.schedulingService.getUser().subscribe(
      (data) => {
        this.userSchedule = data.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        );
      },
      (error) => {
        console.error('Error fetching schedules:', error);
        this.toastr.error('Failed to fetch schedules. Please try again.');
      }
    );
  }
  // Open Add Schedule Modal
  openAddScheduleModal() {
    this.isEditMode = false;
    this.resetForm();
    this.openModal();
  }

  // Edit an existing schedule
  editSchedule(schedule: UsersSchedule) {
    console.log('Editing schedule:', schedule);
    this.isEditMode = true;
    this.newSchedule = {
      ...schedule,
      start_date: schedule.start_date
        ? new Date(schedule.start_date).toISOString().split('T')[0]
        : '',
      end_date: schedule.end_date
        ? new Date(schedule.end_date).toISOString().split('T')[0]
        : '',
    };
    this.openModal();
  }

  // Helper method to open the modal
  openModal() {
    const modalElement = document.getElementById('wsModal');
    if (modalElement) {
      console.log('Opening modal...');
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    } else {
      console.error('Modal element not found');
    }
  }

  // Add or Update a schedule
  onSubmit() {
    this.showLoading();

    if (this.isEditMode && this.newSchedule.id) {
      this.schedulingService
        .updateUser(this.newSchedule.id, this.newSchedule)
        .subscribe(
          (updated) => {
            const index = this.userSchedule.findIndex(
              (u) => u.id === updated.id
            );
            if (index > -1) {
              this.userSchedule[index] = updated;
            }
            this.resetForm();
            this.hideLoading();
            this.toastr.success('Schedule updated successfully!');
          },
          (error) => {
            console.error('Error updating schedule:', error);
            this.toastr.error('Failed to update schedule. Please try again.');
            this.hideLoading();
          }
        );
    } else {
      this.schedulingService.addUser(this.newSchedule).subscribe(
        (user) => {
          this.userSchedule.push(user);
          this.resetForm();
          this.hideLoading();
          this.toastr.success('Schedule added successfully!');
        },
        (error) => {
          console.error('Error adding schedule:', error);
          this.toastr.error('Failed to add schedule. Please try again.');
          this.hideLoading();
        }
      );
    }
  }

  resetForm() {
    this.newSchedule = {
      name: '',
      branch: '',
      department: '',
      schedule_name: '',
      start_date: '',
      end_date: '',
      id: undefined,
    };
  }

  // Delete a schedule
  deleteSchedule(schedule: UsersSchedule) {
    if (!schedule.id) {
      console.error('Error: Schedule ID is undefined.');
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete the schedule for ${schedule.name}?`
      )
    ) {
      this.showLoading();
      this.schedulingService.deleteUser(schedule.id).subscribe(
        () => {
          this.userSchedule = this.userSchedule.filter(
            (u) => u.id !== schedule.id
          );
          this.hideLoading();
          this.toastr.success('Schedule deleted successfully!');
        },
        (error) => {
          console.error('Error deleting schedule:', error);
          this.toastr.error('Failed to delete schedule. Please try again.');
        }
      );
    }
  }
}
