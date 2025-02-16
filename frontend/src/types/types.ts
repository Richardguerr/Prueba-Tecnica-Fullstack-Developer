export interface UserUpdate {
    email?: string;
    name?: string;
    current_password?: string;
    new_password?: string;
}
export interface User {
    id: string;
    name: string;
    email: string;
  }
  