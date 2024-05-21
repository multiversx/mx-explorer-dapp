import { getPercentageFilled, hasDelegationCap } from '../helpers';

interface PercentageFilledUIType {
  locked: string;
  delegationCap: string;
}

export const PercentageFilled = ({
  locked,
  delegationCap
}: PercentageFilledUIType) => {
  const percentage = getPercentageFilled(locked, delegationCap);
  return hasDelegationCap(delegationCap) ? <>{percentage}%</> : <>Uncapped</>;
};
