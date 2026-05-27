import { useSelector } from 'react-redux';

import { SdkDappWrapper } from 'components';
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
  ScExplorerContainer,
  useGetAccountInfo,
  useGetLoginInfo,
  VerifiedContractTabsEnum
} from 'lib';
import { useGetEnvironment } from 'pages/AccountDetails/AccountVerifiedContract/hooks';
import { activeNetworkSelector } from 'redux/selectors';

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

export const SmartContractInteraction = () => {
  const { apiAddress } = useSelector(activeNetworkSelector);
  const environment = useGetEnvironment();
  const extraRequestHeaders = getHeaders();

  if (!environment) return null;

  return (
    <div className='smart-contract-interaction page-content container'>
      <h1 className='mb-4'>Smart Contract Interaction</h1>
      <SdkDappWrapper>
        <ScExplorerContainer
          accountConsumerHandlers={{ useGetLoginInfo, useGetAccountInfo }}
          networkConfig={{ environment, apiAddress }}
          customClassNames={customClassNames}
          icons={icons}
          activeSection={VerifiedContractTabsEnum.loadAbi}
          config={{
            canMutate: false,
            canLoadAbi: true,
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
  );
};
