import React from 'react';
import AppRoutes from './router/AppRoutes';
import { QueryClient, QueryClientProvider } from 'react-query';

const App: React.FC = () => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
       <AppRoutes />;
  </QueryClientProvider>
};

export default App;
