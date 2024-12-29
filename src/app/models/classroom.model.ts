import { Year } from "./year.model";
export class Classroom {
  id: number;
  classroomNumber? : number;
  year : Year;

  constructor(id: number,year:Year,classroomNumber?:number) {
    this.id = id;
    this.classroomNumber = classroomNumber;
    this.year = year;
  }
}
