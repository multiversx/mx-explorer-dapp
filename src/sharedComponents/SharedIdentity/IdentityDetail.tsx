import * as React from 'react';
import { DetailItem } from 'sharedComponents';
import { IdentityType } from 'context/state';
import { useGlobalState } from 'context';

interface IdentityDetailType {
  field: 'stake' | 'stakePercent' | 'validators' | 'score';
  title: string;
  identity: IdentityType;
  colWidth?: string;
}

const IdentityDetail = ({ field, identity, title, colWidth = '6' }: IdentityDetailType) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();
  let Detail = <span className="text-secondary">N/A</span>;
  if (field in identity) {
    switch (field) {
      case 'stake':
        Detail = (
          <>
            {identity.stake.toLocaleString('en')} {erdLabel}
          </>
        );
        break;
      case 'stakePercent':
        Detail = (
          <>{Math.round(identity.stakePercent) > 0 ? Math.round(identity.stakePercent) : '< 1'}%</>
        );
        break;
      case 'validators':
        Detail = <>{identity.validators.toLocaleString('en')}</>;
        break;
      case 'score':
        Detail = <>{Math.round(identity.score).toLocaleString('en')}</>;
        break;
    }
  }
  return (
    <DetailItem title={title} colWidth={colWidth}>
      {Detail}
    </DetailItem>
  );
};

export default IdentityDetail;
