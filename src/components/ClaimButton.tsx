import React from 'react';
import { useTranslation } from 'react-i18next';

interface ClaimButtonProps {
    onClaim: () => void;
    disabled: boolean;
    type: string;
}

const ClaimButton: React.FC<ClaimButtonProps> = ({ onClaim, disabled, type }) => {
    const { t } = useTranslation();

    return (
        <button
            onClick={onClaim}
            disabled={disabled}
            className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${disabled
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 active:scale-95'
                }
      `}
        >
            {disabled ? t('alreadyClaimed') : t('claim')}
        </button>
    );
};

export default ClaimButton;