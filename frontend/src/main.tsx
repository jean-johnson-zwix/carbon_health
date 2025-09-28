// frontend/src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';

import Providers from './app/providers';
import { Routes } from './app/routes';
import { AuthProvider } from './contexts/AuthContext.tsx';
import './index.css';

const container = document.getElementById('root')!;
createRoot(container).render(
  <React.StrictMode>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </React.StrictMode>
);

