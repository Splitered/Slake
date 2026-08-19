import React from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Phone, ExternalLink, Mail, Navigation, Coffee, Sparkles, Footprints, ShieldCheck } from 'lucide-react';
import { soundEngine } from '../utils/audioSynth';
import { useOpeningStatus } from '../hooks/useOpeningStatus';
import { useCms } from '../context/CmsContext';

interface LocationHoursProps {
  lang: 'en' | 'fr';
}

export const LocationHours: React.FC<LocationHoursProps> = ({ lang }) => {
  const openingStatus = useOpeningStatus();
  const { data } = useCms();
  const info = data.restaurantInfo;
  const socials = data.socialLinks;

  return (
    <section id="location" className="py-20 bg-[#FAF9F6] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="badge-yellow mx-auto">
            <MapPin className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Visit Us in Annecy' : 'Nous Trouver à Annecy'}</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#18181B] tracking-tight">
            {lang === 'en' ? 'Location, Hours & Atmosphere' : 'Accès, Horaires & Ambiance'}
          </h2>

          <p className="text-sm sm:text-base text-[#52525B] font-medium">
            {lang === 'en'
              ? 'Tucked just 300 meters away from the turquoise waters of Lake Annecy. Walk-ins always welcome!'
              : 'À seulement 300 mètres des eaux turquoises du lac d’Annecy. Accueil libre et chaleureux sans réservation.'}
          </p>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Hours & Service */}
          <div className="card-modern p-6 bg-white space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFE248] border border-[#18181B] flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#18181B]" />
                  </div>
                  <h3 className="font-display font-black text-base text-[#18181B]">
                    {lang === 'en' ? 'Opening Hours' : 'Horaires d’Ouverture'}
                  </h3>
                </div>
                
                {/* Live Real-Time Pill */}
                <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  openingStatus.isCafeOpen 
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${openingStatus.isCafeOpen ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                  <span>{openingStatus.isCafeOpen ? (lang === 'en' ? 'Open Now' : 'Ouvert') : (lang === 'en' ? 'Closed Now' : 'Fermé')}</span>
                </span>
              </div>

              {/* Real-time Annecy clock callout */}
              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between">
                <span className="text-[#71717A]">{lang === 'en' ? 'Annecy Local Time:' : 'Heure locale Annecy :'}</span>
                <span className="font-mono font-black text-[#18181B] bg-white px-2 py-0.5 rounded border border-zinc-200">
                  {openingStatus.currentTimeStr}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {info.hours.map((h, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#FAF9F6] border border-zinc-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#18181B]">{h.days}</p>
                      <p className="text-[10px] text-[#71717A]">{h.note}</p>
                    </div>
                    <span className="font-mono font-black text-xs text-[#18181B] bg-white px-2 py-1 rounded-md border border-zinc-200">
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {info.showSpecialNotice !== false && (
              <div className="p-3 rounded-xl bg-[#FFFBEB] border border-amber-300 text-xs text-amber-950 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {lang === 'en'
                    ? (info.specialNoticeEn || 'Continuous brunch all day on weekends & holidays!')
                    : (info.specialNoticeFr || 'Brunch continu toute la journée les samedis et dimanches !')}
                </span>
              </div>
            )}
          </div>

          {/* Card 2: Address & Easy Directions */}
          <div className="card-modern p-6 bg-white space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFE248] border border-[#18181B] flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-[#18181B]" />
                  </div>
                  <h3 className="font-display font-black text-base text-[#18181B]">
                    {lang === 'en' ? 'Location & Access' : 'Adresse & Accès'}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#71717A]">
                  Annecy Centre
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-zinc-200 space-y-1">
                  <p className="font-black text-sm text-[#18181B]">{info.address}</p>
                  <p className="text-xs text-[#52525B]">{info.postalCode} {info.city}</p>
                </div>

                <div className="space-y-2 text-xs text-[#52525B]">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                    <Footprints className="w-3.5 h-3.5 text-[#18181B] shrink-0" />
                    <span><strong>3 min walk</strong> {lang === 'en' ? 'from Lake Annecy & Le Pâquier lawn' : 'du Lac d’Annecy et de l’esplanade du Pâquier'}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                    <Footprints className="w-3.5 h-3.5 text-[#18181B] shrink-0" />
                    <span><strong>4 min walk</strong> {lang === 'en' ? 'from Annecy TGV Train Station' : 'de la Gare TGV d’Annecy'}</span>
                  </div>
                </div>
              </div>
            </div>

            <a
              href={socials.googleMaps || `https://maps.google.com/?q=${encodeURIComponent(info.address + ' ' + info.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundEngine.playChime(600, 'sine', 0.1)}
              className="w-full btn-yellow py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_#18181B]"
            >
              <span>{lang === 'en' ? 'Open in Google Maps' : 'Ouvrir sur Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Contact & Café House Rules */}
          <div className="card-modern p-6 bg-[#FFFDF5] space-y-5 flex flex-col justify-between border-2 border-[#18181B]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FFE248] border border-[#18181B] flex items-center justify-center">
                    <Coffee className="w-4 h-4 text-[#18181B]" />
                  </div>
                  <h3 className="font-display font-black text-base text-[#18181B]">
                    {lang === 'en' ? 'Café & Takeaway' : 'Sur Place & À Emporter'}
                  </h3>
                </div>
                <span className="text-[10px] font-black bg-[#FFE248] text-[#18181B] px-2 py-0.5 rounded border border-[#18181B]">
                  Walk-In Café
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-zinc-200 space-y-1">
                  <p className="font-bold text-[#18181B] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#18181B]" />
                    <span>{lang === 'en' ? 'Phone / Questions:' : 'Téléphone / Questions :'}</span>
                  </p>
                  <a
                    href={`tel:${info.phone}`}
                    className="text-xs font-mono font-bold text-[#18181B] hover:underline block pt-0.5"
                  >
                    {info.phone}
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-white border border-zinc-200 space-y-1">
                  <p className="font-bold text-[#18181B] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#18181B]" />
                    <span>Email:</span>
                  </p>
                  <a
                    href={`mailto:${info.email}`}
                    className="text-xs font-mono font-bold text-[#18181B] hover:underline block pt-0.5"
                  >
                    {info.email}
                  </a>
                </div>

                {/* Dog friendly & High chairs highlight callout */}
                <div className="p-3.5 rounded-xl bg-[#FFE248] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">🐾</span>
                    <p className="font-display font-black text-sm sm:text-base text-[#18181B] leading-tight">
                      {lang === 'en' ? 'Dog Friendly & High Chairs Available' : 'Chiens Bienvenus & Chaises Hautes Disponibles'}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-[#18181B]/80 pl-6.5">
                    {lang === 'en' ? 'Pups on leash & families are always warmly welcome.' : 'Vos compagnons à 4 pattes et vos tout-petits sont les bienvenus.'}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1 text-xs text-[#52525B]">
                  <p className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{lang === 'en' ? 'Coffee beans & specialty drip bags for takeaway' : 'Grains de café torréfiés & drip bags à emporter'}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-[11px] font-bold text-[#71717A]">
                {lang === 'en' ? 'No reservation required — join our lively morning counter!' : 'Sans réservation — rejoignez-nous directement au comptoir !'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
