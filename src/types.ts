export enum PaymentMethod {
  PayPal = 'PayPal',
  WeChat = 'WeChat',
  AliPay = 'AliPay'
}

export interface PaymentConfig {
  type: PaymentMethod;
  qrCode: string;
}

export interface DailyUsage {
  zhSummary: number;
  enSummary: number;
  zhAnalysis: number;
  enAnalysis: number;
}
