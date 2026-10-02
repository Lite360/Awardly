import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import RootLayout from '../components/layout/RootLayout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import CategoriesPage from '../pages/CategoriesPage';
import NomineesPage from '../pages/NomineesPage';
import NomineeDetailPage from '../pages/NomineeDetailPage';
import NomineeRegistrationPage from '../pages/NomineeRegistrationPage';
import VotePage from '../pages/VotePage';
import PaymentCallbackPage from '../pages/PaymentCallbackPage';
import LeaderboardPage from '../pages/LeaderboardPage';
import GalleryPage from '../pages/GalleryPage';
import ContactPage from '../pages/ContactPage';
import FaqPage from '../pages/FaqPage';
import TermsPage from '../pages/TermsPage';
import PrivacyPage from '../pages/PrivacyPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }, []);

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="nominees" element={<NomineesPage />} />
        <Route path="nominees/:slug" element={<NomineeDetailPage />} />
        <Route path="register" element={<NomineeRegistrationPage />} />
        <Route path="vote" element={<VotePage />} />
        <Route path="vote/callback" element={<PaymentCallbackPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
