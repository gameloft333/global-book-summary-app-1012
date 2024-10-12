import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { getUserData, setUserUsage } from '../services/userService';
import { DailyUsage } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  onUsageUpdate: (usage: DailyUsage) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onUsageUpdate }) => {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('');
  const [zhSummaryUsage, setZhSummaryUsage] = useState(0);
  const [enSummaryUsage, setEnSummaryUsage] = useState(0);
  const [zhAnalysisUsage, setZhAnalysisUsage] = useState(0);
  const [enAnalysisUsage, setEnAnalysisUsage] = useState(0);

  const handleFetchUser = () => {
    const userData = getUserData(userId);
    setZhSummaryUsage(userData.remainingUsage.zhSummary);
    setEnSummaryUsage(userData.remainingUsage.enSummary);
    setZhAnalysisUsage(userData.remainingUsage.zhAnalysis);
    setEnAnalysisUsage(userData.remainingUsage.enAnalysis);
  };

  const handleUpdateUsage = (type: 'zhSummary' | 'enSummary' | 'zhAnalysis' | 'enAnalysis') => {
    const usage = {
      zhSummary: zhSummaryUsage,
      enSummary: enSummaryUsage,
      zhAnalysis: zhAnalysisUsage,
      enAnalysis: enAnalysisUsage
    }[type];
    setUserUsage(userId, type, usage);
    const updatedUsage = getUserData(userId).remainingUsage;
    onUsageUpdate(updatedUsage);
    alert(t('usageUpdated', { language: t(type) }));
  };

  console.log('AdminPanel 组件被渲染');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">{t('adminPanel')}</h2>
        <div className="mb-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder={t('enterUserId')}
            className="w-full p-2 border rounded"
          />
          <button onClick={handleFetchUser} className="mt-2 bg-blue-500 text-white p-2 rounded">
            {t('fetchUserData')}
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-2">{t('chineseUsage')}:</label>
          <input
            type="number"
            value={zhUsage}
            onChange={(e) => setZhUsage(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
          <button onClick={() => handleUpdateUsage('zh')} className="mt-2 bg-green-500 text-white p-2 rounded">
            {t('updateChineseUsage')}
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-2">{t('englishUsage')}:</label>
          <input
            type="number"
            value={enUsage}
            onChange={(e) => setEnUsage(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
          <button onClick={() => handleUpdateUsage('en')} className="mt-2 bg-green-500 text-white p-2 rounded">
            {t('updateEnglishUsage')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
