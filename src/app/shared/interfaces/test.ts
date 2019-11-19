export interface Test extends Document{
  id: string;
  title: string;
  date: string;
  coefficient: number;
  shown: boolean;
  lessonId: string;
  gradesId: string[];
}
