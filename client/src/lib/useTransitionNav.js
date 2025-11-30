'use client';

import { useRouter } from 'next/navigation';

export function useTransitionNav() {
  const router = useRouter();

  const navigate = (href) => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  return { navigate };
}