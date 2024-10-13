import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: "Global Book Summary Generator",
      enterBookName: "Enter book name",
      generating: "Generating...",
      result: "Result",
      pleaseEnterBookName: "Please enter a book name",
      failedToGenerateSummary: "Failed to generate summary",
      failedToGenerateAnalysis: "Failed to generate analysis",
      summaryChinese: "Summary (Chinese)",
      summaryEnglish: "Summary (English)",
      analysisChinese: "Analysis (Chinese)",
      analysisEnglish: "Analysis (English)",
      unknownError: "Unknown error occurred",
      paymentRequired: "Payment Required",
      dailyLimitReached: "You've reached your daily limit. Please make a payment to continue.",
      close: "Close",
      toggleAdminPanel: "Admin Panel",
      enterAdminKey: "Enter admin key",
      invalidAdminKey: "Invalid admin key",
      adminPanel: "Admin Panel",
      enterUserId: "Enter User ID",
      fetchUserData: "Fetch User Data",
      chineseUsage: "Chinese Usage",
      englishUsage: "English Usage",
      updateChineseUsage: "Update Chinese Usage",
      updateEnglishUsage: "Update English Usage",
      usageUpdated: "{{language}} usage updated successfully",
      chinese: "Chinese",
      english: "English",
      zhSummary: "English Summary",
      enSummary: "English Summary",
      zhAnalysis: "English Analysis",
      enAnalysis: "English Analysis",
      maxRetriesReached: "Max retries reached",
      updateUsage: "Update {{type}} usage"
    }
  },
  zh: {
    translation: {
      appTitle: "全球图书摘要生成器",
      enterBookName: "我想看的书是...",
      generating: "加速阅读中，请稍后...",
      result: "结果",
      pleaseEnterBookName: "请输入书名",
      failedToGenerateSummary: "生成摘要失败",
      failedToGenerateAnalysis: "生成分析失败",
      summaryChinese: "摘要（中文）",
      summaryEnglish: "摘要（英文）",
      analysisChinese: "拆书（中文）",
      analysisEnglish: "拆书（英文）",
      unknownError: "发生未知错误",
      paymentRequired: "需要付款",
      dailyLimitReached: "您已达到每日使用限制。请付款以继续使用。",
      close: "关闭",
      toggleAdminPanel: "管理面板",
      enterAdminKey: "请输入管理员密钥",
      invalidAdminKey: "无效的管理员密钥",
      adminPanel: "管理面板",
      enterUserId: "输入用户ID",
      fetchUserData: "获取用户数据",
      chineseUsage: "中文使用量",
      englishUsage: "英文使用量",
      updateChineseUsage: "更新中文使用量",
      updateEnglishUsage: "更新英文使用量",
      usageUpdated: "{{language}}使用量更新成功",
      chinese: "中文",
      english: "英文",
      zhSummary: "中文摘要",
      enSummary: "英文摘要",
      zhAnalysis: "中文分析",
      enAnalysis: "英文分析",
      maxRetriesReached: "达到最大重试次数",
      updateUsage: "更新{{type}}使用量"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
