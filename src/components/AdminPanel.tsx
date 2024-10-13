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
  const [usages, setUsages] = useState<DailyUsage>({
    zhSummary: 0,
    enSummary: 0,
    zhAnalysis: 0,
    enAnalysis: 0
  });

  const handleFetchUser = async () => {
    const userData = await getUserData(userId);
    setUsages(userData.remainingUsage);
  };

  const handleUpdateUsage = async (type: keyof DailyUsage) => {
    await setUserUsage(userId, type, usages[type]);
    const updatedUsage = (await getUserData(userId)).remainingUsage;
    onUsageUpdate(updatedUsage);
    alert(t('usageUpdated', { language: t(type) }));
  };

  const handleUsageChange = (type: keyof DailyUsage, value: number) => {
    setUsages(prev => ({ ...prev, [type]: value }));
  };

  console.log('AdminPanel 组件被渲染');

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl relative max-w-lg w-full">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('adminPanel')}</h2>
        <div className="mb-6">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder={t('enterUserId')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button onClick={handleFetchUser} className="mt-3 bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600 transition-colors">
            {t('fetchUserData')}
          </button>
        </div>
        {(Object.keys(usages) as Array<keyof DailyUsage>).map((type) => (
          <div key={type} className="mb-6">
            <label className="block mb-2 text-gray-700 font-semibold">{t(type)}:</label>
            <input
              type="number"
              value={usages[type]}
              onChange={(e) => handleUsageChange(type, parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button onClick={() => handleUpdateUsage(type)} className="mt-3 bg-green-500 text-white p-3 rounded-lg w-full hover:bg-green-600 transition-colors">
              {t('updateUsage', { type: t(type) })}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;