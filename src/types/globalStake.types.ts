import { NodesVersionsType } from 'types';

export interface GlobalStakeType {
  queueSize: number;
  waitingList?: number;
  deliquentStake?: number;
  nodesVerions?: NodesVersionsType[];
}
