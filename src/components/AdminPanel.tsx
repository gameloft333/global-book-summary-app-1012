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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
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
          <button onClick={handleFetchUser} className="mt-2 bg-blue-500 text-white p-2 rounded w-full">
            {t('fetchUserData')}
          </button>
        </div>
        {(Object.keys(usages) as Array<keyof DailyUsage>).map((type) => (
          <div key={type} className="mb-4">
            <label className="block mb-2">{t(type)}:</label>
            <input
              type="number"
              value={usages[type]}
              onChange={(e) => handleUsageChange(type, parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <button onClick={() => handleUpdateUsage(type)} className="mt-2 bg-green-500 text-white p-2 rounded w-full">
              {t('updateUsage', { type: t(type) })}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
