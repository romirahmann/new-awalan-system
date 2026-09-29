export interface RegisterData {
  store_id: number;
  role_id: number;
  username: string;
  full_name: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}
