export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
};

export const actionSuccess = <T>(data: T, message?: string): ActionResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
}

export const actionError = (error: string, code?: string): ActionResponse => {
  return {
    success: false,
    error,
    code,
  };
}