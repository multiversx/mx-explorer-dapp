import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';

import { Loader, SdkDappWrapper } from 'components';
import { faClone } from 'icons/regular';
import {
  faAngleDown,
  faAngleRight,
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
  useGetAccountInfo,
  useGetLoginInfo,
  VerifiedContractTabsEnum
} from 'lib';
import { useGetEnvironment } from 'pages/AccountDetails/AccountVerifiedContract/hooks';
import { activeNetworkSelector } from 'redux/selectors';

import '@multiversx/sdk-dapp-sc-explorer/out/styles.css';

const ScExplorerContainer = lazy(() =>
  import('@multiversx/sdk-dapp-sc-explorer/out/containers/ScExplorerContainer').then(
    (module) => ({ default: module.ScExplorerContainer })
  )
);

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
  badgeActiveClassName: 'badge-outline badge-rounded badge-property active',
  badgeInactiveClassName: 'badge-outline badge-rounded badge-property inactive',
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

export const SmartContractInteraction = () => {
  const { apiAddress } = useSelector(activeNetworkSelector);
  const environment = useGetEnvironment();
  const extraRequestHeaders = getHeaders();

  if (!environment) return null;

  return (
    <div className='smart-contract-interaction page-content container'>
      <div className={'page-hero card card-lg card-black mb-3'}>
        <div className='card-header'>
          <h2 className='title mb-0 text-capitalize'>
            Smart Contract Interaction
          </h2>
        </div>
        <div className='card-body'>
          <SdkDappWrapper>
            <Suspense fallback={<Loader />}>
              <ScExplorerContainer
                accountConsumerHandlers={{ useGetLoginInfo, useGetAccountInfo }}
                networkConfig={{ environment, apiAddress }}
                customClassNames={customClassNames}
                icons={icons}
                activeSection={VerifiedContractTabsEnum.loadAbi}
                config={{
                  canMutate: true,
                  canLoadAbi: true,
                  canDeploy: true,
                  canUpgrade: true,
                  canDisplayContractDetails: true,
                  hasViewInExplorer: false,
                  hasGeneralLogin: true,
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
            </Suspense>
          </SdkDappWrapper>
        </div>
      </div>
    </div>
  );
};
