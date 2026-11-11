import React from 'react';

/* Sichtbare Kennzeichnung KI-generierter Bilder (KI-Verordnung Art. 50). Eltern-Element braucht position: relative. */
export const KiBadge: React.FC = () => (
  <span aria-hidden="true" className="pointer-events-none absolute z-[3] top-3 right-3 rounded-full bg-gray-900/75 px-2.5 py-1 text-[11px] font-semibold leading-tight text-white">
    KI-generiert
  </span>
);

export const isKiImage = (src: string) => /^(img\/|\.\.\/ux-evaluation\/media\/)/.test(src);
