// /src/components/StatusMessage.js :

import React from 'react';
import { useTranslation } from 'react-i18next';

export function StatusMessage({ headingKey, textKey, type = 'info', className = '' }) {
  const { t } = useTranslation();

  const baseStyle = {
    info: 'border-blue-300 bg-blue-50 text-blue-800',
    success: 'border-green-300 bg-green-50 text-green-800',
    warning: 'border-yellow-300 bg-yellow-50 text-yellow-800',
    error: 'border-red-300 bg-red-50 text-red-800',
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-md ${baseStyle[type] || baseStyle.info} ${className}`}
      data-testid="status-message"
    >
      <p className="font-semibold mb-1">{t(headingKey)}</p>
      <p>{t(textKey)}</p>
    </div>
  );
}
