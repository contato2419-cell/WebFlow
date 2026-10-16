import React, { useState, useEffect, useMemo } from 'react';
import { InstagramIcon } from '../Icons';
import { MessageCircle, User } from 'lucide-react';

// Paleta de gradientes modernos e elegantes idêntica ao ManyChat e Meta Business Suite
const MONOGRAM_PALETTES = [
  'from-violet-600 to-indigo-600',
  'from-blue-600 to-cyan-600',
  'from-emerald-600 to-teal-600',
  'from-rose-600 to-pink-600',
  'from-amber-600 to-orange-600',
  'from-fuchsia-600 to-purple-600',
  'from-sky-600 to-blue-700'
];

export const getMonogramGradient = (str) => {
  if (!str) return MONOGRAM_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  return MONOGRAM_PALETTES[Math.abs(hash) % MONOGRAM_PALETTES.length];
};

export const getInitials = (str) => {
  if (!str) return '';
  const clean = str.replace(/^@/, '').replace(/[^a-zA-Z0-9]/g, '');
  if (!clean) return str.replace(/^@/, '').slice(0, 2).toUpperCase();
  if (clean.length === 1) return clean.toUpperCase();
  return clean.slice(0, 2).toUpperCase();
};

export const UserAvatar = ({ 
  name = '', 
  handle = '', 
  avatar = null, 
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showBadge = true, 
  channel = 'instagram',
  className = '',
  onClick = null
}) => {
  const [imgError, setImgError] = useState(false);
  const cleanHandle = useMemo(() => (handle || name || '').replace(/^@/, '').toLowerCase().trim(), [handle, name]);
  
  // Identificação do dono (@ygorweb e @yygor02) e da marca (@vitrixapp)
  const isOwner = cleanHandle === 'ygorweb' || cleanHandle === 'yygor02' || name === 'Ygor Souza';
  const isVitrix = cleanHandle === 'vitrixapp' || cleanHandle === 'vitrix';

  // Resolução da foto real:
  // 1. Dono do sistema (@ygorweb e @yygor02) -> foto oficial local (/avatar_ygorweb.jpg)
  // 2. VitrixApp (@vitrixapp) -> logo oficial local (/logo.jpg)
  // 3. Foto real da Meta CDN (apenas URLs válidas e sem fotos de stock/IA)
  const realPhoto = useMemo(() => {
    if (isOwner) return '/avatar_ygorweb.jpg';
    if (isVitrix) return '/logo.jpg';
    if (avatar && !imgError && !avatar.includes('unsplash.com')) return avatar;
    return null;
  }, [cleanHandle, isOwner, isVitrix, avatar, imgError]);

  useEffect(() => {
    setImgError(false);
  }, [avatar, cleanHandle]);

  // Tamanhos
  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs font-bold',
    lg: 'w-12 h-12 text-sm font-bold',
    xl: 'w-14 h-14 text-base font-bold'
  };

  const badgeSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
    xl: 'w-4.5 h-4.5'
  };

  const initials = useMemo(() => getInitials(cleanHandle || name), [cleanHandle, name]);
  const gradientClass = useMemo(() => getMonogramGradient(cleanHandle), [cleanHandle]);

  return (
    <div 
      onClick={onClick}
      className={`relative shrink-0 select-none ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
    >
      {/* Moldura de Story do Instagram: idêntico ao Instagram App oficial */}
      <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
        <div className="rounded-full bg-white dark:bg-slate-900 p-0.5">
          {realPhoto ? (
            <img
              src={realPhoto}
              alt={name || handle || 'Foto de Perfil'}
              referrerPolicy="no-referrer"
              onError={() => {
                if (!imgError) setImgError(true);
              }}
              className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover shadow-2xs`}
            />
          ) : (
            /* Fallback estilo ManyChat e Meta Business Suite: Monograma em Gradiente Vibrante com Tipografia Nítida */
            <div 
              className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white tracking-wider font-extrabold shadow-inner select-none`}
            >
              {initials || <User className="w-1/2 h-1/2 text-white/90" />}
            </div>
          )}
        </div>
      </div>

      {showBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-slate-100 dark:border-slate-800">
          {channel === 'instagram' ? (
            <InstagramIcon className={`${badgeSizeClasses[size] || badgeSizeClasses.md} text-rose-500`} />
          ) : (
            <MessageCircle className={`${badgeSizeClasses[size] || badgeSizeClasses.md} text-emerald-500`} />
          )}
        </span>
      )}
    </div>
  );
};

