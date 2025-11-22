import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useDebounce, useSearch } from 'hooks';
import { setSearch } from 'redux/slices';

import { useGetSearchRedirectRoute } from './useGetSearchRedirectRoute';
import { handleArrowDown, handleArrowUp, useOutsideClick } from '../helpers';

interface HandleInputProps {
  inputRef: any;
  wrapperRef: any;
}

export const useHandleInput = ({ inputRef, wrapperRef }: HandleInputProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchHash, setSearchHash] = useState<string>('');
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const { search } = useSearch(searchHash);

  const onDebounceInputChange = useDebounce(searchHash, 600);

  const redirectRoute = useGetSearchRedirectRoute();

  useEffect(
    () => handleDebouncedChange(onDebounceInputChange),
    [onDebounceInputChange]
  );

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await search();
      if (redirectRoute) {
        dispatch(
          setSearch({ search: {}, searchQuery: '', isDataReady: undefined })
        );
        navigate(redirectRoute);
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setIndex(0);
      setShow(false);
      setSearchHash('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = String(e.target.value).trimStart();
    setSearchHash(trimmedValue);

    if (trimmedValue && !show) {
      setShow(true);
    }

    if (trimmedValue.length < 3) {
      return;
    }

    dispatch(
      setSearch({
        search: {},
        searchQuery: trimmedValue,
        isDataReady: false
      })
    );
  };

  const handleOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    search();

    if (redirectRoute) {
      dispatch(
        setSearch({
          search: {},
          searchQuery: '',
          isDataReady: undefined
        })
      );
      navigate(redirectRoute);
    }
  };

  const handleDebouncedChange = (value: string) => {
    const trimmedValue = String(value).trim();
    if (trimmedValue.length < 3) {
      return;
    }

    search();
  };

  useHotkeys(['/', 'shift+/'], (ev) => {
    if (show) {
      return;
    }
    ev.preventDefault();

    inputRef?.current?.focus?.();
    setShow(true);
  });
  useHotkeys('Escape', (ev) => {
    if (!show) {
      return;
    }
    ev.preventDefault();

    setShow(false);
    setIndex(0);
    setSearchHash('');
  });
  useHotkeys('down', () => handleArrowDown(index, setIndex), {
    enableOnFormTags: true
  });
  useHotkeys('up', () => handleArrowUp(index, setIndex), {
    enableOnFormTags: true
  });

  useOutsideClick(
    wrapperRef.current,
    () => {
      setShow(false);
      setIndex(0);
      setSearchHash('');
    },
    [wrapperRef.current]
  );

  return {
    show,
    setShow,
    searchHash,
    setSearchHash,
    handleKeyDown,
    handleChange,
    handleOnClick
  };
};
