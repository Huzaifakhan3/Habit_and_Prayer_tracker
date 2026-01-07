import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'insights'>('dashboard');

  return (
    <>
      {currentPage === 'dashboard' ? (
        <Dashboard onNavigate={setCurrentPage} />
      ) : (
        <Insights onNavigate={setCurrentPage} />
      )}
    </>
  );
}

export default App;
