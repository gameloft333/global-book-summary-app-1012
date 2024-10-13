import React, { useState, useEffect } from 'react';
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
  const [rechargeAmounts, setRechargeAmounts] = useState<DailyUsage>({
    zhSummary: config.minRechargeAmount,
    enSummary: config.minRechargeAmount,
    zhAnalysis: config.minRechargeAmount,
    enAnalysis: config.minRechargeAmount
  });

  useEffect(() => {
    setRechargeAmounts({
      zhSummary: config.minRechargeAmount,
      enSummary: config.minRechargeAmount,
      zhAnalysis: config.minRechargeAmount,
      enAnalysis: config.minRechargeAmount
    });
  }, [isOpen]);

  const handleAmountChange = (type: keyof DailyUsage, increment: boolean) => {
    setRechargeAmounts(prev => {
      const currentAmount = prev[type];
      let newAmount;
      if (increment) {
        newAmount = currentAmount + config.rechargeUnit;
      } else {
        newAmount = Math.max(config.minRechargeAmount, currentAmount - config.rechargeUnit);
      }
      return { ...prev, [type]: newAmount };
    });
  };

  const calculatePrice = (type: keyof DailyUsage): number => {
    const amount = rechargeAmounts[type];
    const { defaultPrice, discountFactor } = config.rechargeOptions[type];
    return isNaN(amount) ? 0 : amount * defaultPrice * discountFactor;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full shadow-2xl transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('rechargeTitle')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(config.rechargeOptions).map(([type, option]) => (
            <div key={type} className="bg-gray-50 rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">{t(type)}</h3>
                <span className="text-sm text-gray-500">{t('remainingUsage')}: {dailyUsage[type as keyof DailyUsage]}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-white rounded-lg shadow-sm">
                  <button
                    onClick={() => handleAmountChange(type as keyof DailyUsage, false)}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center text-xl font-semibold">
                    {rechargeAmounts[type as keyof DailyUsage]}
                  </span>
                  <button
                    onClick={() => handleAmountChange(type as keyof DailyUsage, true)}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">¥{calculatePrice(type as keyof DailyUsage).toFixed(2)}</p>
                  <button
                    onClick={() => onRecharge(type as keyof DailyUsage, rechargeAmounts[type as keyof DailyUsage])}
                    className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
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
}

export default RechargeModal;