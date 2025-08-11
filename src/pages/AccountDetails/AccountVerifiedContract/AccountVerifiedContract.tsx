import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Loader, PageState } from 'components';
import { useNetworkRoute, useIsMainnet } from 'hooks';
import { faClone } from 'icons/regular';
import {
  faAngleDown,
  faAngleRight,
  faCommand,
  faListTree,
  faList,
  faQuestionCircle,
  faLink,
  faFileCode,
  faPen,
  faEye,
  faUserLock,
  faTerminal,
  faReceipt,
  faPlus,
  faMinus,
  faPlay,
  faSpinner
} from 'icons/solid';
import { getHeaders } from 'interceptors';
import {
  ScExplorerContainer,
  useGetAccountInfo,
  useGetLoginInfo,
  VerifiedContractTabsEnum,
  VerifiedContractType
} from 'lib';
import { accountSelector, activeNetworkSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

import { getVerifiedContractSectionUrl } from './helpers';
import { useGetActiveSection, useGetEnvironment } from './hooks';
import { SdkDappWrapper } from './SdkDappWrapper';

export interface AccountVerifiedContractUIType extends WithClassnameType {
  contract?: VerifiedContractType;
  isDataReady?: boolean;
}

export const AccountVerifiedContract = ({
  contract,
  isDataReady
}: AccountVerifiedContractUIType) => {
  const networkRoute = useNetworkRoute();
  const navigate = useNavigate();
  const pathActiveSection = useGetActiveSection();
  const isMainnet = useIsMainnet();
  const { account } = useSelector(accountSelector);
  const { address, isVerified } = account;
  const { apiAddress } = useSelector(activeNetworkSelector);
  const environment = useGetEnvironment();
  const extraRequestHeaders = getHeaders();

  const [activeSection, setActiveSection] =
    useState<VerifiedContractTabsEnum>(pathActiveSection);

  useEffect(() => {
    if (activeSection !== pathActiveSection) {
      const route = getVerifiedContractSectionUrl(activeSection, address);
      const options = {
        pathname: networkRoute(route)
      };
      navigate(options, { replace: true });
    }
  }, [activeSection]);

  if (!isVerified || !environment) {
    return null;
  }

  const customClassNames = {
    cardClassName: 'card card-black',
    cardHeaderClassName: 'card-header',
    cardBodyClassName: 'card-body',
    badgeClassName: 'badge',
    badgePrimaryClassName: 'badge-outline badge-outline-primary-alt',
    badgeSecondaryClassName: 'badge-outline badge-outline-grey',
    badgeFilledClassName: 'badge-grey',
    cardItemClassName: 'card-item',
    cardItemIconClassName: 'card-item-icon',
    cardItemTitleClassName: 'card-item-title',
    cardItemValueClassName: 'card-item-value',
    buttonClassName: 'btn btn-sm',
    buttonPrimaryClassName: 'btn-primary',
    buttonSecondaryClassName: 'btn-dark',
    inputClassName: 'form-control',
    inputInvalidClassName: 'is-invalid',
    inputInvalidFeedbackClassName: 'invalid-feedback',
    inputGroupClassName: 'input-group input-group-seamless has-validation',
    inputGroupAppendClassName: 'input-group-text',
    selectClassName: 'form-control form-select'
  };

  const icons = {
    expandedIcon: faAngleDown,
    collapsedIcon: faAngleRight,
    structTypeIcon: faListTree,
    enumTypeIcon: faList,
    hintIcon: faQuestionCircle,
    copyIcon: faClone,
    linkIcon: faLink,
    contractFileIcon: faFileCode,
    mutableEndpointIcon: faPen,
    readonlyEndpointIcon: faEye,
    onlyOwnerEndpointIcon: faUserLock,
    interactiveEndpointIcon: faTerminal,
    payableEndpointIcon: faReceipt,
    plusIcon: faPlus,
    minusIcon: faMinus,
    playIcon: faPlay,
    loadIcon: faSpinner
  };

  return (
    <>
      {isDataReady === undefined && (
        <Loader data-testid='verifiedContractLoader' />
      )}
      {isDataReady === false && (
        <PageState
          icon={faCommand}
          title='Unable to load Smart Contract'
          isError
        />
      )}
      {isDataReady === true && contract && (
        <div>
          <SdkDappWrapper>
            <ScExplorerContainer
              smartContract={{
                verifiedContract: contract,
                deployedContractDetails: account
              }}
              accountConsumerHandlers={{
                useGetLoginInfo,
                useGetAccountInfo
              }}
              networkConfig={{ environment, apiAddress }}
              customClassNames={customClassNames}
              icons={icons}
              className='mx-4'
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              config={{
                canMutate: !isMainnet,
                canLoadAbi: false,
                canDeploy: false,
                canUpgrade: false,
                canDisplayContractDetails: false,
                ...(extraRequestHeaders
                  ? {
                      loginParams: {
                        nativeAuth: {
                          extraRequestHeaders
                        }
                      }
                    }
                  : {})
              }}
            />
          </SdkDappWrapper>
        </div>
      )}
    </>
  );
};
