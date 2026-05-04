export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
