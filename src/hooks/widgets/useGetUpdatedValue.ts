import { useEffect, useMemo, useRef } from 'react';
import BigNumber from 'bignumber.js';

interface GetUpdatedValueProps {
  initialValue?: number;
  currentValue?: number;
}

export const useGetUpdatedValue = ({
  initialValue = 0,
  currentValue = 0
}: GetUpdatedValueProps) => {
  const previousValue = useRef(0);
  const previousUpdatedValue = useRef(0);

  const updatedValue = useMemo(() => {
    if (
      !currentValue ||
      !previousValue.current ||
      !previousUpdatedValue.current
    ) {
      return initialValue;
    }

    const currentInitialValue = new BigNumber(
      previousUpdatedValue.current
    ).isGreaterThan(initialValue)
      ? previousUpdatedValue.current
      : initialValue;

    if (new BigNumber(currentValue).isLessThan(previousValue.current)) {
      return initialValue;
    }

    const valueDiff = new BigNumber(currentValue).minus(previousValue.current);
    const updatedValue = new BigNumber(currentInitialValue).plus(valueDiff);

    if (new BigNumber(currentInitialValue).isGreaterThan(updatedValue)) {
      return currentInitialValue;
    }

    return updatedValue.toNumber();
  }, [initialValue, previousValue, currentValue, previousUpdatedValue]);

  useEffect(() => {
    if (!currentValue) {
      return;
    }

    previousValue.current = currentValue;
  }, [currentValue]);

  useEffect(() => {
    if (!updatedValue) {
      return;
    }

    previousUpdatedValue.current = updatedValue;
  }, [updatedValue]);

  return updatedValue;
};
