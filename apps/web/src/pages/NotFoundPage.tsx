import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F4FAF5] flex items-center justify-center text-center">
      <Helmet>
        <title>404 - Page Not Found | Awardly</title>
      </Helmet>

      <div className="max-w-md px-4">
        <div className="bg-white rounded-3xl p-10 space-y-6 border border-[#E2EFE7] shadow-md">
          <div className="text-7xl font-display font-black text-[#007A4D]">404</div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-[#0B2B1B] mb-2">Page Not Found</h1>
            <p className="text-sm text-[#526c60]">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
          <Link to="/" className="w-full bg-[#007A4D] hover:bg-[#006640] text-white font-extrabold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-md">
            🏠 Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
