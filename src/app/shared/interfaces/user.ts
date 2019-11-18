export interface User extends Document {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  groupsId: string[];
}
