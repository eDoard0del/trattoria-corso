import { useCallback } from 'react';

interface ScrollToOptions {
  offset?: number;
  behavior?: ScrollBehavior;
}

const NAVBAR_HEIGHT = 80;

export function useScrollTo() {
  const scrollToSection = useCallback(
    (target: string | HTMLElement, options?: ScrollToOptions) => {
      const offset = options?.offset ?? NAVBAR_HEIGHT;
      const behavior = options?.behavior ?? 'smooth';

      let element: HTMLElement | null;

      if (typeof target === 'string') {
        element = document.querySelector(target);
      } else {
        element = target;
      }

      if (element) {
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior,
        });

        return true;
      }

      return false;
    },
    [],
  );

  const scrollToTop = useCallback((options?: ScrollToOptions) => {
    const behavior = options?.behavior ?? 'smooth';
    window.scrollTo({ top: 0, behavior });
  }, []);

  return { scrollToSection, scrollToTop, NAVBAR_HEIGHT };
}
