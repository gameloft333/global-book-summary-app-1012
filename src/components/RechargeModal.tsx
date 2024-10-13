import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
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

  const handleAmountChange = (type: keyof DailyUsage, amount: number) => {
    setRechargeAmounts(prev => ({ ...prev, [type]: amount }));
  };

  const calculatePrice = (type: keyof DailyUsage) => {
    const { defaultPrice, discountFactor } = config.rechargeOptions[type];
    return defaultPrice * discountFactor * rechargeAmounts[type];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4">{t('rechargeTitle')}</h2>
        {Object.entries(config.rechargeOptions).map(([type, option]) => (
          <div key={type} className="mb-4 p-4 border rounded">
            <h3 className="font-semibold mb-2">{t(type)}</h3>
            <p>{t('defaultPrice')}: ¥{option.defaultPrice}</p>
            <p>{t('discountPrice')}: ¥{(option.defaultPrice * option.discountFactor).toFixed(2)}</p>
            <p>{t('remainingUsage')}: {dailyUsage[type as keyof DailyUsage]}</p>
            <div className="flex items-center mt-2">
              <input
                type="number"
                min="1"
                value={rechargeAmounts[type as keyof DailyUsage]}
                onChange={(e) => handleAmountChange(type as keyof DailyUsage, parseInt(e.target.value) || 1)}
                className="w-20 p-2 border rounded mr-2"
              />
              <p className="flex-grow">{t('totalPrice')}: ¥{calculatePrice(type as keyof DailyUsage).toFixed(2)}</p>
              <button
                onClick={() => onRecharge(type as keyof DailyUsage, rechargeAmounts[type as keyof DailyUsage])}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {t('recharge')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RechargeModal;
