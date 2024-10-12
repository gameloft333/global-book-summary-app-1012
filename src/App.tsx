import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generateBookSummary } from './services/geminiService';
import { generateBookAnalysis } from './services/kimiService';
import QRCode from 'qrcode.react';
import config from './config';
import { Book, AlertCircle, Settings } from 'lucide-react';
import { generateUserId } from './services/userIdService';
import { DailyUsage, PaymentMethod } from './types';
import PaymentModal from './components/PaymentModal';
import AdminPanel from './components/AdminPanel';
import { getUserData, updateUserUsage } from './services/userService';

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [bookName, setBookName] = useState('');
  const [summary, setSummary] = useState('');
  const [isGeneratingZhSummary, setIsGeneratingZhSummary] = useState(false);
  const [isGeneratingEnSummary, setIsGeneratingEnSummary] = useState(false);
  const [isGeneratingZhAnalysis, setIsGeneratingZhAnalysis] = useState(false);
  const [isGeneratingEnAnalysis, setIsGeneratingEnAnalysis] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [themeColor, setThemeColor] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>({ zhSummary: 0, enSummary: 0, zhAnalysis: 0, enAnalysis: 0 });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    setThemeColor(getRandomColor());
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = generateUserId();
      setUserId(newUserId);
      localStorage.setItem('userId', newUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const userData = getUserData(userId);
      setDailyUsage(userData.remainingUsage);
    }
  }, [userId]);

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const handleGenerateSummary = async (lang: 'zh' | 'en') => {
    if (!bookName) {
      setError(t('pleaseEnterBookName'));
      return;
    }
    const usageType = lang === 'zh' ? 'zhSummary' : 'enSummary';
    if (dailyUsage[usageType] <= 0) {
      setShowPaymentModal(true);
      return;
    }
    setIsGeneratingZhSummary(lang === 'zh');
    setIsGeneratingEnSummary(lang === 'en');
    setLanguage(lang);
    setError(null);
    setSummary('');
    try {
      const result = await generateBookSummary(bookName, lang);
      setSummary(result);
      setQrValue(result);
      updateUserUsage(userId, usageType);
      setDailyUsage(prevUsage => ({
        ...prevUsage,
        [usageType]: prevUsage[usageType] - 1
      }));
    } catch (error) {
      console.error('Error generating summary:', error);
      if (error instanceof Error) {
        setError(t('failedToGenerateSummary') + ': ' + error.message);
      } else {
        setError(t('failedToGenerateSummary') + ': ' + t('unknownError'));
      }
    } finally {
      setIsGeneratingZhSummary(false);
      setIsGeneratingEnSummary(false);
    }
  };

  const handleGenerateAnalysis = async (lang: 'zh' | 'en') => {
    if (!bookName) {
      setError(t('pleaseEnterBookName'));
      return;
    }
    const usageType = lang === 'zh' ? 'zhAnalysis' : 'enAnalysis';
    if (dailyUsage[usageType] <= 0) {
      setShowPaymentModal(true);
      return;
    }
    setIsGeneratingZhAnalysis(lang === 'zh');
    setIsGeneratingEnAnalysis(lang === 'en');
    setLanguage(lang);
    setError(null);
    setSummary('');
    try {
      const result = await generateBookAnalysis(bookName, lang);
      setSummary(result);
      setQrValue(result);
      updateUserUsage(userId, usageType);
      setDailyUsage(prevUsage => ({
        ...prevUsage,
        [usageType]: prevUsage[usageType] - 1
      }));
    } catch (error) {
      console.error('Error generating analysis:', error);
      if (error instanceof Error) {
        setError(t('failedToGenerateAnalysis') + ': ' + error.message);
      } else {
        setError(t('failedToGenerateAnalysis') + ': ' + t('unknownError'));
      }
    } finally {
      setIsGeneratingZhAnalysis(false);
      setIsGeneratingEnAnalysis(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const getRemainingUsage = (type: 'zhSummary' | 'enSummary' | 'zhAnalysis' | 'enAnalysis') => {
    return Math.max(0, dailyUsage[type]);
  };

  const handleAdminPanelToggle = () => {
    const adminKey = prompt(t('enterAdminKey'));
    console.log('输入的管理员密钥:', adminKey);
    if (adminKey === config.adminKey) {
      console.log('密钥验证成功，切换管理面板状态');
      setShowAdminPanel(!showAdminPanel);
      console.log('管理面板状态:', !showAdminPanel);
    } else {
      console.log('密钥验证失败');
      alert(t('invalidAdminKey'));
    }
  };

  const handleUsageUpdate = (updatedUsage: DailyUsage) => {
    setDailyUsage(updatedUsage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[600px] border-t-4" style={{ borderColor: themeColor }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Book className="w-6 h-6 mr-2" style={{ color: themeColor }} />
            <h1 className="text-xl font-bold" style={{ color: themeColor }}>{t('appTitle')}</h1>
          </div>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-full hover:bg-opacity-80 transition duration-300"
            style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
          >
            {i18n.language === 'en' ? '↑↓ 中' : '↑↓ EN'}
          </button>
        </div>
        <input
          type="text"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          placeholder={t('enterBookName')}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 transition duration-300"
          style={{ focusRingColor: themeColor }}
        />
        <div className="flex justify-between mb-4">
          <button
            onClick={() => handleGenerateSummary('zh')}
            disabled={isGeneratingZhSummary}
            className="w-[40%] text-white py-2 px-4 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-300 relative"
            style={{ backgroundColor: themeColor }}
          >
            {isGeneratingZhSummary ? t('generating') : t('summaryChinese')}
            <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {getRemainingUsage('zhSummary')}
            </span>
          </button>
          <button
            onClick={() => handleGenerateSummary('en')}
            disabled={isGeneratingEnSummary}
            className="w-[40%] text-white py-2 px-4 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-300 relative"
            style={{ backgroundColor: themeColor }}
          >
            {isGeneratingEnSummary ? t('generating') : t('summaryEnglish')}
            <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {getRemainingUsage('enSummary')}
            </span>
          </button>
        </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={() => handleGenerateAnalysis('zh')}
            disabled={isGeneratingZhAnalysis}
            className="w-[40%] text-white py-2 px-4 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-300 relative"
            style={{ backgroundColor: themeColor }}
          >
            {isGeneratingZhAnalysis ? t('generating') : t('analysisChinese')}
            <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {getRemainingUsage('zhAnalysis')}
            </span>
          </button>
          <button
            onClick={() => handleGenerateAnalysis('en')}
            disabled={isGeneratingEnAnalysis}
            className="w-[40%] text-white py-2 px-4 rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-300 relative"
            style={{ backgroundColor: themeColor }}
          >
            {isGeneratingEnAnalysis ? t('generating') : t('analysisEnglish')}
            <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {getRemainingUsage('enAnalysis')}
            </span>
          </button>
        </div>
        {error && (
          <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {summary && (
          <div className="mt-6 p-4 rounded-lg relative" style={{ backgroundColor: `${themeColor}10` }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: themeColor }}>{t('result')}</h2>
            <p className="text-gray-700 whitespace-pre-wrap mb-4">{summary}</p>
            <div 
              className="absolute" 
              style={{
                top: config.qrCode.marginTop,
                right: config.qrCode.marginRight,
                opacity: config.qrCode.opacity
              }}
            >
              <QRCode 
                value={config.qrCode.link || qrValue} 
                size={config.qrCode.size} 
                fgColor={themeColor}
              />
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handleAdminPanelToggle}
            className="text-gray-500 hover:text-gray-700 transition duration-300"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div 
            className="text-gray-500"
            style={{
              opacity: config.userId.opacity,
              fontSize: config.userId.fontSize
            }}
          >
            ID: {userId}
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelectPayment={(method) => {
          setSelectedPaymentMethod(method);
          setShowPaymentModal(false);
        }}
      />
      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          onUsageUpdate={handleUsageUpdate}
        />
      )}
    </div>
  );
};

export default App;