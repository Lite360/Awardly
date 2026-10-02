import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getGallery } from '../services/public';
import type { GalleryImage } from '@awardly/shared-types';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    getGallery().then((res) => {
      if (res && res.length) {
        setImages(res);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F4F9F5]">
      <Helmet>
        <title>Gallery | Awardly 2026</title>
        <meta name="description" content="Highlights, gala photos, and moments of excellence from Awardly celebrations." />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative py-20 bg-[#0B2B1B] text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#008751_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
        <div className="relative container">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Gallery
          </h1>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto">
            Moments of Excellence
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-extrabold text-[#0B2B1B]">Moments of Excellence</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mt-3 text-sm leading-relaxed">
            Relive the most memorable moments from the Awardly Award celebrations. From inspiring speeches to heartwarming celebrations, explore our curated collection of unforgettable moments.
          </p>
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img: GalleryImage) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img.url)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E2EFE7] group cursor-pointer hover:shadow-md hover:border-[#008751]/40 transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.altText || img.caption || 'Gallery Moment'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B1B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-semibold text-xs flex items-center gap-1.5">
                      📷 {img.caption || img.altText || 'View Moment'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
              'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&q=80',
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
              'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80',
              'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
              'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80',
              'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
            ].map((url, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(url)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E2EFE7] group cursor-pointer hover:shadow-md hover:border-[#008751]/40 transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={url}
                    alt="Awardly Award Celebration"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2B1B]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-semibold text-xs">
                      📷 View Moment
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Be Part of the Next Celebration Banner */}
        <div className="mt-16 bg-[#008751] rounded-3xl p-10 md:p-14 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">
            Be Part of the Next Celebration
          </h2>
          <p className="text-emerald-100 max-w-xl mx-auto text-base">
            Join us in celebrating African excellence and create unforgettable memories together!
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/vote" className="bg-white text-[#0B2B1B] hover:bg-slate-100 font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition-all">
              Vote Now
            </Link>
            <Link to="/register" className="border-2 border-white text-white hover:bg-white hover:text-[#008751] font-bold px-8 py-3.5 rounded-full text-sm transition-all">
              Nominate Talent
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-[#0B2B1B]/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white text-3xl hover:text-[#EBF547]"
          >
            ✕
          </button>
          <img src={selectedImage} alt="Enlarged gallery moment" className="max-w-full max-h-[85vh] rounded-2xl object-contain border border-white/20" />
        </div>
      )}
    </div>
  );
}
