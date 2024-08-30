export const scrollToElement = (selector: string, timeout?: number) => {
  const activeElement = document.querySelector(selector);
  setTimeout(() => {
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
      });
    }
  }, timeout);
};
