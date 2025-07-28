import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from "react-router";
import { router } from './Router/router.jsx';
import AuthProvider from './Provider/AuthProvider.jsx';

// ✅ React Query setup
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// ✅ Create the query client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
