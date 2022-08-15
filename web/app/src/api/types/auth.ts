export interface UserLogin {
  username: string;
  password: string;
}

export interface UserResponse {
  username: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface UserSignup {
  username: string;
  email: string;
  password: string;
}
