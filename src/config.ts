import { PaymentMethod } from './types';

const config = {
  qrCode: {
    size: 120,
    marginTop: '80px',
    marginRight: '20px',
    opacity: 0.5,
    link: 'http://weixin.qq.com/r/7R2TlqfERG84KOP1b0hp',
  },
  userId: {
    fontSize: '12px',
    marginBottom: '10px',
    marginRight: '10px',
    opacity: 0.5,
  },
  version: '0.7.10',
  dailyLimits: {
    zhSummary: 6,
    enSummary: 6,
    zhAnalysis: 6,
    enAnalysis: 6
  },
  adminKey: 'iDSV1NrPbUXoULPxXhmO', // This should be a secure key in a real application
  paymentMethods: {
    paypal: {
      type: PaymentMethod.PayPal,
      qrCode: 'https://example.com/paypal-qr-code.png',
    },
    wechat: {
      type: PaymentMethod.WeChat,
      qrCode: 'https://example.com/wechat-qr-code.png',
    },
    alipay: {
      type: PaymentMethod.AliPay,
      qrCode: 'https://example.com/alipay-qr-code.png',
    },
  },
  rechargeOptions: {
    zhSummary: { defaultPrice: 5, discountFactor: 0.05, maxRecharge: 9999 },
    enSummary: { defaultPrice: 5, discountFactor: 0.07, maxRecharge: 9999 },
    zhAnalysis: { defaultPrice: 5, discountFactor: 0.1, maxRecharge: 9999 },
    enAnalysis: { defaultPrice: 5, discountFactor: 0.2, maxRecharge: 9999 },
  },
  rechargeUnit: 20,
  minRechargeAmount: 40,
  pointDeductions: {
    zhSummary: 2,
    enSummary: 3,
    zhAnalysis: 3,
    enAnalysis: 6,
  },
};

export default config;
