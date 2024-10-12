import React from 'react';
import { useTranslation } from 'react-i18next';
import config from '../config';
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPayment: (method: PaymentMethod) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSelectPayment }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">{t('paymentRequired')}</h2>
        <p className="mb-4">{t('dailyLimitReached')}</p>
        <div className="flex justify-around">
          {Object.entries(config.paymentMethods).map(([key, method]) => (
            <button
              key={key}
              onClick={() => onSelectPayment(method.type)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              {method.type}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-600 hover:text-gray-800 transition duration-300"
        >
          {t('close')}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;