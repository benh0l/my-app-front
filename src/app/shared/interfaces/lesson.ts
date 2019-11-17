export interface Lesson extends Document {
  id: string;
  name: string;
  testsId: string[];
  teacherId: string;
  groupId: string;
}
