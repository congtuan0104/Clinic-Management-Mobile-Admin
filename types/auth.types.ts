export interface IUserInfo {
  id: string;
  email: string;
  emailVerified: boolean;
  role: string;
  // firstName: string;
  // lastName: string;
  // token: string;
  // avatar: string;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUserInfo;
  token: string;
}

export interface IRegisterResponse {
  user: IUserInfo;
}
