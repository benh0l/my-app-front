export interface Group extends Document {
  id: string;
  name: string;
  startDate: number;
  endDate: number;
  studentsId: string[];
  responsibleId: string;
  lessonsId: string[];
}
