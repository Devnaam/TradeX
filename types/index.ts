export interface User {
  id: number;
  name: string;
  phone: string;
  referralCode: string;
  rechargeBalance: number;
  incomeBalance: number;
  totalWithdraw: number;
  isBlocked: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
