import { Dispatch, SetStateAction } from 'react';

const getSelectableElements = () => {
  const selectableElements = [...document.getElementsByClassName('selectable')];

  if (selectableElements.length === 0) return undefined;
  return selectableElements as HTMLElement[];
};

export const handleArrowDown = (
  index: number,
  setIndex: Dispatch<SetStateAction<number>>
) => {
  const selectable = getSelectableElements();
  if (!selectable) return;

  if (index === selectable.length - 1) {
    setIndex(0);
    selectable[0].focus();
  } else {
    setIndex((prevIdx) => prevIdx + 1);
    selectable[index + 1].focus();
  }
};

export const handleArrowUp = (
  index: number,
  setIndex: Dispatch<SetStateAction<number>>
) => {
  const selectable = getSelectableElements();
  if (!selectable) return;

  if (index === 0) {
    setIndex(selectable.length - 1);
    selectable[selectable.length - 1].focus();
  } else {
    setIndex((prevIdx) => prevIdx - 1);
    selectable[index - 1].focus();
  }
};
