// Authentication screens (login/signup)

export interface AuthScreenProps {
  navigation: any;
  route: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: "student" | "driver" | "admin";
  name: string;
}

export {};
