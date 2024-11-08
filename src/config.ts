import { PaymentMethod } from './types';

type ApiProvider = 'gemini' | 'kimi';

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
  // 每天可领取次数
  dailyClaimLimits: {
    zhSummary: 1,
    enSummary: 1,
    zhAnalysis: 1,
    enAnalysis: 1
  },
  // 每次可领取点数
  dailyClaimAmount: {
    zhSummary: 2,
    enSummary: 2,
    zhAnalysis: 2,
    enAnalysis: 2
  },
  // 添加 API 服务配置
  apiServices: {
    summary: {
      preferredProvider: 'kimi' as ApiProvider,    // 摘要优先使用 Kimi
      retryCount: 3,                               // 可选：添加重试次数配置
      useBackup: false,    // 添加此配置禁用备用服务
    },
    analysis: {
      preferredProvider: 'kimi' as ApiProvider,  // 分析优先使用 kimi
      retryCount: 3,                               // 可选：添加重试次数配置
      useBackup: false,    // 添加此配置禁用备用服务
    }
  },
};

export type { ApiProvider };  // 导出类型定义
export default config;
