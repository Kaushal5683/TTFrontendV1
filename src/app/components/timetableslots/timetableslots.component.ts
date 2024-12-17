// timetableslots.component.ts
import { Component, OnInit } from '@angular/core';
import { TimetableSlots } from '../../models/timetableslots.model';
import { TimetableSlotsService } from '../../services/timetableslots.service';
import { Year } from '../../models/year.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Classroom } from '../../models/classroom.model';

@Component({
  selector: 'app-timetableslots',
  templateUrl: './timetableslots.component.html',
  styleUrls: ['./timetableslots.component.css']
})
export class TimetableSlotsComponent implements OnInit {
  timetableSlots: TimetableSlots[] = [];
  years: Year[] = [];
  selectedYearId: number | null = null;
  generateForm: FormGroup;

  constructor(
    private timetableService: TimetableSlotsService,
    private fb: FormBuilder
  ) {
    this.generateForm = this.fb.group({
      yearId: [null]
    });
  }

  ngOnInit(): void {
    this.loadTimetables();
    this.loadYears();
  }

  loadTimetables(): void {
    this.timetableService.getAllTimetables().subscribe(
      (data) => {
        this.timetableSlots = data;
      },
      (error) => {
        console.error('Error loading timetables:', error);
      }
    );
  }

  loadYears(): void {
    this.timetableService.getAllYears().subscribe(
      (years) => {
        this.years = years; // Assign the fetched array of years.
      },
      (error) => {
        console.error('Error loading years:', error);
      }
    );
  }
  

  generateTimetable(): void {
    if (this.generateForm.valid) {
      const yearId = this.generateForm.value.yearId;
      this.timetableService.generateTimetable(yearId).subscribe(
        (message) => {
          alert(message);
          this.loadTimetables();
        },
        (error) => {
          console.error('Error generating timetable:', error);
        }
      );
    }
  }

  getDays(): number[] {
    return Array.from({ length: this.years[0]?.numberOfDays || 5 }, (_, i) => i ); // Example: 5 days
  }

  getSlots(): number[] {
    return Array.from({ length: this.years[0]?.slotsPerDay || 8 }, (_, i) => i); // Example: 8 slots
  }

  getClassrooms(): Classroom[] {
    return this.timetableSlots.map(slot => slot.classroom).filter((value, index, self) =>
      index === self.findIndex((t) => t.id === value.id)
    );
  }

  getTimetableNumbers(): number[] {
    return Array.from(new Set(this.timetableSlots.map(slot => slot.timetableNumber)));
  }

  getSubjectForSlot(classroomId: number, day: number, slot: number, timetableNumber: number): TimetableSlots | null {
    return this.timetableSlots.find(
      t => t.classroom.id === classroomId && t.day === day && t.slot === slot && t.timetableNumber === timetableNumber
    ) || null;
  }
}
