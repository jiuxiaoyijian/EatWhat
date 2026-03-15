import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DishManagePage from './pages/DishManagePage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <main className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dishes" element={<DishManagePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </HashRouter>
  );
}
