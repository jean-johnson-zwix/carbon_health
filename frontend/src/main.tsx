// frontend/src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';

import Providers from './app/providers';
import { Routes } from './app/routes';

import './index.css';

const container = document.getElementById('root')!;
createRoot(container).render(
  <React.StrictMode>
    <Providers>
      <Routes />
    </Providers>
  </React.StrictMode>
);

