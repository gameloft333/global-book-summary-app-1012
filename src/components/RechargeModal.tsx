import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Minus } from 'lucide-react';
import config from '../config';
import { DailyUsage } from '../types';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyUsage: DailyUsage;
  onRecharge: (type: keyof DailyUsage, amount: number) => void;
}

const RechargeModal: React.FC<RechargeModalProps> = ({ isOpen, onClose, dailyUsage, onRecharge }) => {
  const { t } = useTranslation();
  const [rechargeAmounts, setRechargeAmounts] = useState<Record<keyof DailyUsage, number>>({
    zhSummary: 1,
    enSummary: 1,
    zhAnalysis: 1,
    enAnalysis: 1,
  });

  if (!isOpen) return null;

  const handleAmountChange = (type: keyof DailyUsage, change: number) => {
    setRechargeAmounts(prev => ({
      ...prev,
      [type]: Math.max(1, prev[type] + change)
    }));
  };

  const calculatePrice = (type: keyof DailyUsage) => {
    const { defaultPrice, discountFactor } = config.rechargeOptions[type];
    return defaultPrice * discountFactor * rechargeAmounts[type];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl relative w-full max-w-4xl overflow-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold p-6 text-gray-800 border-b">{t('rechargeTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {Object.entries(config.rechargeOptions).map(([type, option]) => (
            <div key={type} className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">{t(type)}</h3>
                <span className="text-sm text-gray-500">{t('remainingUsage')}: {dailyUsage[type as keyof DailyUsage]}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => handleAmountChange(type as keyof DailyUsage, -1)}
                    className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="mx-4 text-xl font-semibold">{rechargeAmounts[type as keyof DailyUsage]}</span>
                  <button
                    onClick={() => handleAmountChange(type as keyof DailyUsage, 1)}
                    className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">¥{calculatePrice(type as keyof DailyUsage).toFixed(2)}</p>
                  <button
                    onClick={() => onRecharge(type as keyof DailyUsage, rechargeAmounts[type as keyof DailyUsage])}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {t('recharge')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RechargeModal;
