import { useRouter } from 'next/navigation';

export function useTransitionNavigation() {
  const router = useRouter();

  const push = (href) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  const replace = (href) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.replace(href);
      });
    } else {
      router.replace(href);
    }
  };

  const refresh = () => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.refresh();
      });
    } else {
      router.refresh();
    }
  };

  return { push, replace, refresh };
}