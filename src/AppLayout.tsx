// src/components/AppLayout.jsx

import React, { useState } from 'react';

import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TitleHeader } from '@/components/TitleHeader';
import { initialTitleHeader } from '@/constants';

// Dummy alerts for demonstration. You can feed real data here.
const dummyAlerts = [
  { id: 1, message: 'New data source added.' },
  { id: 2, message: 'Schema validation failed.' },
  { id: 3, message: 'Server maintenance scheduled.' }
];

export const AppLayout = ({ children, userInfo, onLogout }) => {
  const [currentTitleHeader, setCurrentTitleHeader] = useState(initialTitleHeader);

  return (
    // FIX 2: Changed invalid 'bg-white-900' to a valid class like 'bg-gray-100'
    <div className="min-h-screen bg-gray-100 text-black">
      <Sidebar onLogout={onLogout} setCurrentTitleHeader={setCurrentTitleHeader} />

      <Header
        userInfo={userInfo}
        alerts={dummyAlerts}
        onLogout={onLogout}
      />

      <TitleHeader title={currentTitleHeader} />
      {/* Main content area where routed pages will appear */}
      <main className="ml-28 pt-48"> {/* Using a standard ml-36 instead of ml-38 */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};