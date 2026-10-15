import React, { useState, useEffect, useMemo } from 'react';
import { InstagramIcon } from '../Icons';
import { MessageCircle } from 'lucide-react';

// Pool curado de retratos humanos de alta resolução (Unsplash) para perfis sem foto ou com consentimento restrito pela Meta (#230)
const DETERMINISTIC_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80'
];

export const getDeterministicAvatar = (str) => {
  if (!str) return DETERMINISTIC_AVATARS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  return DETERMINISTIC_AVATARS[Math.abs(hash) % DETERMINISTIC_AVATARS.length];
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
  const isOwner = cleanHandle === 'ygorweb' || name === 'Ygor Souza';
  const isVitrix = cleanHandle === 'vitrixapp' || cleanHandle === 'vitrix';

  // Resolução da foto com prioridade estrita:
  // 1. Dono do sistema (@ygorweb) -> foto oficial local
  // 2. VitrixApp (@vitrixapp) -> logo oficial local
  // 3. Foto customizada salva localmente pelo usuário no botão Foto
  // 4. URL direta da Meta (avatar)
  // 5. Retrato determinístico humano persistente baseado no @handle
  const resolvedPhoto = useMemo(() => {
    if (isOwner) return '/avatar_ygorweb.jpg';
    if (isVitrix) return '/logo.jpg';
    try {
      const customSaved = localStorage.getItem('user_avatar_' + cleanHandle);
      if (customSaved) return customSaved;
    } catch (e) {}
    if (avatar && !imgError) return avatar;
    return getDeterministicAvatar(cleanHandle);
  }, [cleanHandle, isOwner, isVitrix, avatar, imgError]);

  useEffect(() => {
    setImgError(false);
  }, [avatar, cleanHandle]);

  // Tamanhos
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
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

  return (
    <div 
      onClick={onClick}
      className={`relative shrink-0 select-none ${onClick ? 'cursor-pointer hover:opacity-90' : ''} ${className}`}
    >
      {/* Moldura de Story do Instagram: idêntico ao Instagram App oficial */}
      <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
        <div className="rounded-full bg-white dark:bg-slate-900 p-0.5">
          <img
            src={resolvedPhoto}
            alt={name || handle || 'Foto de Perfil'}
            referrerPolicy="no-referrer"
            onError={() => {
              if (!imgError) setImgError(true);
            }}
            className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover shadow-2xs`}
          />
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
