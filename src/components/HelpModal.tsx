import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import config from '../config';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('helpTitle')}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {Object.entries(config.pointDeductions).map(([type, points]) => (
            <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{t(type)}</span>
              <span className="text-blue-600 font-semibold">{t('pointDeduction', { points })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
