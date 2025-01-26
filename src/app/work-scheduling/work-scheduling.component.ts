import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../services/scheduling.service';
import { UsersSchedule } from '../models/users-schedule';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

// Imports here...

@Component({
  selector: 'app-work-scheduling',
  templateUrl: './work-scheduling.component.html',
  styleUrls: ['./work-scheduling.component.css'],
})
export class WorkSchedulingComponent implements OnInit {
  isLoading = false;
  userSchedule: UsersSchedule[] = [];
  filteredSchedules: UsersSchedule[] = [];
  currentPage = 1;
  searchQuery = '';
  newSchedule: UsersSchedule = {
    name: '',
    branch: '',
    department: '',
    schedule_name: '',
    start_date: '',
    end_date: '',
  };
  isEditMode = false;
  deleteTarget: UsersSchedule | null = null;

  constructor(
    private schedulingService: SchedulingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchSchedules();
  }

  onSearchChange(): void {
    this.fetchSchedules();
  }

  fetchSchedules(): void {
    this.isLoading = true;
    this.schedulingService.getUser(this.searchQuery).subscribe(
      (data) => {
        this.userSchedule = data;
        this.filteredSchedules = [...data];
        this.isLoading = false;
      },
      (error) => {
        this.toastr.error('Failed to fetch schedules.');
        this.isLoading = false;
      }
    );
  }

  openAddScheduleModal() {
    this.isEditMode = false;
    this.resetForm();
    this.openModal('wsModal');
  }

editSchedule(schedule: UsersSchedule) {
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
  this.openModal('wsModal');
}


  onSubmit() {
    if (this.isEditMode) {
      this.updateSchedule();
    } else {
      this.addSchedule();
    }
  }

  addSchedule() {
    this.schedulingService.addUser(this.newSchedule).subscribe(
      (schedule) => {
        this.userSchedule.push(schedule);
        this.fetchSchedules();
        this.closeModal('wsModal');
        this.toastr.success('Schedule added successfully.');
      },
      () => this.toastr.error('Failed to add schedule.')
    );
  }

  updateSchedule() {
    this.schedulingService
      .updateUser(this.newSchedule.id!, this.newSchedule)
      .subscribe(
        (updatedSchedule) => {
          this.userSchedule = this.userSchedule.map((s) =>
            s.id === updatedSchedule.id ? updatedSchedule : s
          );
          this.fetchSchedules();
          this.closeModal('wsModal');
          this.toastr.success('Schedule updated successfully.');
        },
        () => this.toastr.error('Failed to update schedule.')
      );
  }

  confirmDelete(schedule: UsersSchedule) {
    this.deleteTarget = schedule;
    this.openModal('deleteConfirmModal');
  }

  deleteScheduleConfirmed() {
    if (this.deleteTarget?.id) {
      this.schedulingService.deleteUser(this.deleteTarget.id).subscribe(
        () => {
          this.userSchedule = this.userSchedule.filter(
            (s) => s.id !== this.deleteTarget!.id
          );
          this.fetchSchedules();
          this.closeModal('deleteConfirmModal');
          this.toastr.success('Schedule deleted successfully.');
        },
        () => this.toastr.error('Failed to delete schedule.')
      );
    }
  }

  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
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
    };
  }
}
