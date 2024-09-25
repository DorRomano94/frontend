import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from '../pages/RegistrationPage';
import LoginPage from '../pages/LoginPage';
import PortfolioPage from '../pages/PortfolioPage';
import PrivateRoute from '../components/PrivateRoute';
import SymbolDetailsPage from '../pages/SymbolDetailsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />


        <Route element={<PrivateRoute />}>
          <Route path="/symbol/:symbol" element={<SymbolDetailsPage />} />
        </Route>


        <Route element={<PrivateRoute />}>
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Route>

        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
