export interface UserLoginType {
    data: UserDataType;
    status: number;
    email: string;
    token: string;
    roles?: string[];
}

export interface UserDataType {
    id: string;
    roles?: string[];
    email: string;
    firstName: string;
    exp?: number;
    iat?: number;
}
export interface loginType {
username: string,
      password:string
}
export interface resetPasswordRequestType{
 email:string;
}
export interface ResetPasswordEntryType {
    email: string,
    token: string,
    newPassword: string,
    confirmPassword: string   
}