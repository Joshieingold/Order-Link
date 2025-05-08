import React from 'react';
import { LoginPage } from './components/loginpage/loginpage';
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import RequireAuth from './components/General/requireAuth/requireAuth';
import { HomePage } from './components/homePage/homePage';
import OrderStatisticsPage from './components/ordersPage/orderStatistics/orderStatistics';
import { OrderReview } from './components/ordersPage/orderReview/orderReview';
import { OrderHistory } from './components/ordersPage/orderHistory/orderHistory';
import { ProductionPage } from './components/productionPage/production';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Home" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/Orders" element={<RequireAuth><OrderStatisticsPage /></RequireAuth>} />
        <Route path="OrderReview" element={<RequireAuth><OrderReview /></RequireAuth>} />
        <Route path="OrderHistory" element={<RequireAuth><OrderHistory /></RequireAuth>} />
        <Route path="*" element={<LoginPage />}/>
        <Route path="/prod" element={<ProductionPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
