import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generateBookSummary } from './services/geminiService';
import { generateBookAnalysis } from './services/kimiService';
import QRCode from 'qrcode.react';
import config from './config';
import { Book, AlertCircle, Settings, CreditCard, HelpCircle } from 'lucide-react';
import { generateUserId } from './services/userIdService';
import { DailyUsage, PaymentMethod } from './types';
import PaymentModal from './components/PaymentModal';
import AdminPanel from './components/AdminPanel';
import { getUserData, updateUserUsage, rechargeUserUsage, claimDailyUsage, resetClaimStatus } from './services/userService';
import RechargeModal from './components/RechargeModal';
import HelpModal from './components/HelpModal';

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
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>({
    zhSummary: 0,
    enSummary: 0,
    zhAnalysis: 0,
    enAnalysis: 0
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setIsLoading(true);
        const storedUserId = localStorage.getItem('userId');
        let currentUserId;
        if (storedUserId) {
          currentUserId = storedUserId;
        } else {
          currentUserId = generateUserId();
          localStorage.setItem('userId', currentUserId);
        }
        setUserId(currentUserId);
        const userData = await getUserData(currentUserId);
        setDailyUsage(userData.remainingUsage);
      } catch (error) {
        console.error('Error initializing user:', error);
        setError('Failed to initialize user data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    setThemeColor(getRandomColor());
  }, []);

  useEffect(() => {
    const fetchLatestUserData = async () => {
      if (userId) {
        try {
          const userData = await getUserData(userId);
          setDailyUsage(userData.remainingUsage);
        } catch (error) {
          console.error('Error fetching latest user data:', error);
        }
      }
    };

    fetchLatestUserData();
  }, [userId]);

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  const handleGenerateSummary = async (lang: 'zh' | 'en') => {
    const usageType = lang === 'zh' ? 'zhSummary' : 'enSummary';
    const pointsToDeduct = config.pointDeductions[usageType];
    if (dailyUsage[usageType] < pointsToDeduct) {
      setShowRechargeModal(true);
      return;
    }
    if (!bookName.trim()) {
      setNotification(t('pleaseEnterBookName'));
      return;
    }
    setNotification(null);
    setIsGeneratingZhSummary(lang === 'zh');
    setIsGeneratingEnSummary(lang === 'en');
    setLanguage(lang);
    try {
      const result = await generateBookSummary(bookName, lang);
      setSummary(result);
      setQrValue(result);
      await updateUserUsage(userId!, usageType, pointsToDeduct);
      const updatedUserData = await getUserData(userId!);
      setDailyUsage(updatedUserData.remainingUsage);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(t('failedToGenerateSummary') + ': ' + (error instanceof Error ? error.message : t('unknownError')));
    } finally {
      setIsGeneratingZhSummary(false);
      setIsGeneratingEnSummary(false);
    }
  };

  const handleGenerateAnalysis = async (lang: 'zh' | 'en') => {
    const usageType = lang === 'zh' ? 'zhAnalysis' : 'enAnalysis';
    const pointsToDeduct = config.pointDeductions[usageType];
    if (dailyUsage[usageType] < pointsToDeduct) {
      setShowRechargeModal(true);
      return;
    }
    if (!bookName.trim()) {
      setNotification(t('pleaseEnterBookName'));
      return;
    }
    setNotification(null);
    setIsGeneratingZhAnalysis(lang === 'zh');
    setIsGeneratingEnAnalysis(lang === 'en');
    setLanguage(lang);
    try {
      const result = await generateBookAnalysis(bookName, lang);
      setSummary(result);
      setQrValue(result);
      await updateUserUsage(userId!, usageType, pointsToDeduct);
      const updatedUserData = await getUserData(userId!);
      setDailyUsage(updatedUserData.remainingUsage);
    } catch (error) {
      console.error('Error generating analysis:', error);
      setError(t('failedToGenerateAnalysis') + ': ' + (error instanceof Error ? error.message : t('unknownError')));
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
    return Math.max(0, dailyUsage[type] || 0);
  };

  const handleAdminPanelToggle = () => {
    const adminKey = prompt(t('enterAdminKey'));
    if (adminKey === import.meta.env.VITE_ADMIN_KEY) {
      setShowAdminPanel(!showAdminPanel);
    } else {
      alert(t('invalidAdminKey'));
    }
  };

  const handleUsageUpdate = (updatedUsage: DailyUsage) => {
    setDailyUsage(updatedUsage);
  };

  const handleRecharge = async (type: keyof DailyUsage, amount: number) => {
    try {
      if (!userId) throw new Error('User ID is not set');
      await rechargeUserUsage(userId, type, amount);
      const updatedUserData = await getUserData(userId);
      setDailyUsage(updatedUserData.remainingUsage);
      setShowRechargeModal(false);
      alert(t('rechargeSuccess', { type: t(type), amount }));
    } catch (error) {
      console.error('Error recharging:', error);
      alert('Failed to recharge. Please try again.');
    }
  };

  const handleClaim = async () => {
    if (!userId) return;
    try {
      await claimDailyUsage(userId);
      const updatedUserData = await getUserData(userId);
      setDailyUsage(updatedUserData.remainingUsage);
      // const claimedTypes = Object.keys(config.dailyClaimAmount).map(type => t(type)).join(', ');
      // setNotification(t('claimSuccess', { type: claimedTypes }));
      setNotification(t('claimSuccessAll'));
    } catch (error) {
      if (error instanceof Error) {
        setNotification(error.message);
      } else {
        setNotification(t('unknownError'));
      }
    }
  };

  const handleResetClaim = async () => {
    if (!userId) return;
    try {
      await resetClaimStatus(userId);
      setNotification(t('claimStatusReset'));
    } catch (error) {
      console.error('Error resetting claim status:', error);
      setNotification(t('errorResettingClaimStatus'));
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-[700px] border-t-4 border-purple-500 text-white">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Book className="w-8 h-8 mr-3 text-purple-400" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              {t('appTitle')}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClaim}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-4 rounded-full hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transform hover:scale-105 transition duration-300 ease-in-out"
            >
              {t('claim')}
            </button>
            <button
              onClick={toggleLanguage}
              className="bg-gray-700 text-white py-2 px-4 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
            >
              {i18n.language === 'en' ? '中文' : 'EN'}
            </button>
          </div>
        </div>
        <input
          type="text"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          placeholder={t('enterBookName')}
          className="w-full px-6 py-4 bg-gray-700 text-white rounded-full mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 placeholder-gray-400"
        />
        <div className="grid grid-cols-2 gap-4 mb-6">
          {i18n.language === 'zh' ? (
            <>
              <button
                onClick={() => handleGenerateSummary('zh')}
                disabled={isGeneratingZhSummary}
                className="col-span-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-2 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className="relative z-10 text-xs">{isGeneratingZhSummary ? t('generating') : t('summaryChinese')}</span>
                <span className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold rounded-bl-lg px-1 py-0.5">
                  {getRemainingUsage('zhSummary')}
                </span>
                {isGeneratingZhSummary && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-ping absolute h-full w-full rounded-lg bg-purple-400 opacity-75"></span>
                  </span>
                )}
              </button>
              <button
                onClick={() => handleGenerateAnalysis('zh')}
                disabled={isGeneratingZhAnalysis}
                className="col-span-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-2 rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className="relative z-10 text-xs">{isGeneratingZhAnalysis ? t('generating') : t('analysisChinese')}</span>
                <span className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold rounded-bl-lg px-1 py-0.5">
                  {getRemainingUsage('zhAnalysis')}
                </span>
                {isGeneratingZhAnalysis && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-ping absolute h-full w-full rounded-lg bg-pink-400 opacity-75"></span>
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleGenerateSummary('en')}
                disabled={isGeneratingEnSummary}
                className="col-span-1 bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-2 rounded-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className="relative z-10 text-xs">{isGeneratingEnSummary ? t('generating') : t('summaryEnglish')}</span>
                <span className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold rounded-bl-lg px-1 py-0.5">
                  {getRemainingUsage('enSummary')}
                </span>
                {isGeneratingEnSummary && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-ping absolute h-full w-full rounded-lg bg-teal-400 opacity-75"></span>
                  </span>
                )}
              </button>
              <button
                onClick={() => handleGenerateAnalysis('en')}
                disabled={isGeneratingEnAnalysis}
                className="col-span-1 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-2 rounded-lg hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className="relative z-10 text-xs">{isGeneratingEnAnalysis ? t('generating') : t('analysisEnglish')}</span>
                <span className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold rounded-bl-lg px-1 py-0.5">
                  {getRemainingUsage('enAnalysis')}
                </span>
                {isGeneratingEnAnalysis && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-ping absolute h-full w-full rounded-lg bg-orange-400 opacity-75"></span>
                  </span>
                )}
              </button>
            </>
          )}
        </div>
        {notification && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg animate-pulse">
            {notification}
          </div>
        )}
        {summary && (
          <div className="mt-8 p-6 rounded-lg relative bg-gradient-to-br from-gray-700 to-gray-800 shadow-inner">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">{t('result')}</h2>
            <p className="text-gray-300 whitespace-pre-wrap mb-4">{summary}</p>
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
                fgColor="#8B5CF6"
                bgColor="transparent"
              />
            </div>
          </div>
        )}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleAdminPanelToggle}
            className="text-gray-400 hover:text-purple-400 transition duration-300"
          >
            <Settings className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowRechargeModal(true)}
            className="text-gray-400 hover:text-green-400 transition duration-300 ml-2"
          >
            <CreditCard className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowHelpModal(true)}
            className="text-gray-400 hover:text-blue-400 transition duration-300 ml-2"
          >
            <HelpCircle className="w-6 h-6" />
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
      <RechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        dailyUsage={dailyUsage}
        onRecharge={handleRecharge}
      />
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
};

export default App;