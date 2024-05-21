import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';

export const useScollInView = () => {
  const [elementsIndexesInView, setElementsIndexesInView] = useState<number[]>(
    []
  );

  const scrollableElements = useRef<HTMLElement[]>([]);
  const dispersionIndexes = scrollableElements.current.map((_, index) => index);

  const shouldDisplayArrow = (index: number) =>
    elementsIndexesInView.length > 0 && !elementsIndexesInView.includes(index);

  const [firstElementIndex] = dispersionIndexes;
  const [lastElementIndex] = dispersionIndexes.slice().reverse();

  const showLeftInViewArrow = shouldDisplayArrow(firstElementIndex);
  const showRightInViewArrow = shouldDisplayArrow(lastElementIndex);

  const handleElementReference = (element: HTMLElement | null) => {
    if (!element || scrollableElements.current.includes(element)) {
      return;
    }

    scrollableElements.current.push(element);
  };

  const handleScrollIntoView = (elementIndex: number) => {
    const elementToScrollToView = scrollableElements.current[elementIndex];
    const scrollIntoViewOptions: ScrollIntoViewOptions = {
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    };

    elementToScrollToView.scrollIntoView(scrollIntoViewOptions);
  };

  const handlePreviousArrowClick = (event: MouseEvent<HTMLElement>) => {
    const previousElementIndex = Math.min(...elementsIndexesInView);
    const previousElementExists = elementsIndexesInView.length > 1;
    const processedIndex = previousElementExists
      ? previousElementIndex
      : previousElementIndex - 1;

    event.preventDefault();
    event.stopPropagation();
    handleScrollIntoView(processedIndex);
  };

  const handleNextArrowClick = (event: MouseEvent<HTMLElement>) => {
    const nextElementIndex = Math.max(...elementsIndexesInView);
    const nextElementExists = elementsIndexesInView.length > 1;
    const processedIndex = nextElementExists
      ? nextElementIndex
      : nextElementIndex + 1;

    event.preventDefault();
    event.stopPropagation();
    handleScrollIntoView(processedIndex);
  };

  const processIndexFromEntry = (
    currentInViewEntry: IntersectionObserverEntry
  ) => {
    const currentElement = currentInViewEntry.target as HTMLElement;
    const currentIndex = Number(currentElement.dataset.index);

    return currentIndex;
  };

  const filterIntersections = (observerEntry: IntersectionObserverEntry) =>
    observerEntry.isIntersecting;

  const updateElementInViewStatus = (
    observerEntries: IntersectionObserverEntry[]
  ) => {
    setElementsIndexesInView((currentIndexesInView) => {
      if (currentIndexesInView.length === 0) {
        return observerEntries
          .filter(filterIntersections)
          .map(processIndexFromEntry);
      }

      const newOutViewIndexes = observerEntries
        .filter((observerEntry) => !observerEntry.isIntersecting)
        .map(processIndexFromEntry);

      const newInViewIndexes = observerEntries
        .filter(filterIntersections)
        .map(processIndexFromEntry);

      const cumulatedIndexes = currentIndexesInView.concat(newInViewIndexes);
      const updatedElementInViewIndexes = cumulatedIndexes.filter(
        (index) => !newOutViewIndexes.includes(index)
      );

      return updatedElementInViewIndexes;
    });
  };

  const observer = useMemo(
    () =>
      new IntersectionObserver(updateElementInViewStatus, {
        threshold: 1,
        rootMargin: '100% 0% 100% 0%'
      }),
    [scrollableElements]
  );

  useEffect(() => {
    scrollableElements.current.forEach((scrollableElement) => {
      observer.observe(scrollableElement);
    });

    return () => observer.disconnect();
  }, []);

  return {
    handleElementReference,
    handleNextArrowClick,
    handlePreviousArrowClick,
    showLeftInViewArrow,
    showRightInViewArrow
  };
};
