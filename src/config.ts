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
    zhSummary: 5,
    enSummary: 3,
    zhAnalysis: 4,
    enAnalysis: 2,
  },
  adminKey: '1', // This should be a secure key in a real application
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
};

export default config;
