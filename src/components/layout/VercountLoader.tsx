'use client';

import { useEffect } from 'react';

const PRODUCTION_HOSTNAME = 'liuhtbupt.github.io';
const SCRIPT_ID = 'prism-vercount-script';

export default function VercountLoader() {
  useEffect(() => {
    if (window.location.hostname !== PRODUCTION_HOSTNAME) return;
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = 'https://vercount.one/js';
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
