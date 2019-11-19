export interface Grade extends Document {
  id: string;
  userId: string;
  testId: string;
  value: number;
}
