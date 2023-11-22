import { useEffect, useState } from 'react';
import { useGetLoginInfo, useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { NotificationModal } from '@multiversx/sdk-dapp/UI/NotificationModal/NotificationModal';
import { SignTransactionsModals } from '@multiversx/sdk-dapp/UI/SignTransactionsModals/SignTransactionsModals';
import { TransactionsToastList } from '@multiversx/sdk-dapp/UI/TransactionsToastList/TransactionsToastList';
import { DappProvider } from '@multiversx/sdk-dapp/wrappers/DappProvider/DappProvider';
import { ScExplorerContainer } from '@multiversx/sdk-dapp-sc-explorer/containers/ScExplorerContainer';
import { VerifiedContractTabsEnum } from '@multiversx/sdk-dapp-sc-explorer/types/base.types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Loader, PageState } from 'components';
import { useAdapter, useNetworkRoute, useIsMainnet } from 'hooks';
import { faClone } from 'icons/regular';
import {
  faAngleDown,
  faAngleRight,
  faFileAlt,
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
import { accountSelector, activeNetworkSelector } from 'redux/selectors';
import { VerifiedContractType } from 'types';
import { getVerifiedContractSectionUrl } from './helpers';
import { useGetActiveSection, useGetEnvironment } from './hooks';

export const AccountVerifiedContract = () => {
  const networkRoute = useNetworkRoute();
  const navigate = useNavigate();
  const pathActiveSection = useGetActiveSection();
  const isMainnet = useIsMainnet();
  const { getAccountContractVerification } = useAdapter();
  const { account } = useSelector(accountSelector);
  const { address, isVerified } = account;
  const { apiAddress } = useSelector(activeNetworkSelector);
  const environment = useGetEnvironment();

  const [contract, setContract] = useState<VerifiedContractType>();
  const [isDataReady, setIsDataReady] = useState<undefined | boolean>();
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

  const fetchContractVerification = () => {
    getAccountContractVerification({ address }).then(({ success, data }) => {
      if (success && data) {
        setContract(data);
      }
      setIsDataReady(success);
    });
  };

  useEffect(() => {
    if (address && isVerified) {
      fetchContractVerification();
    }
  }, [address, isVerified]);

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
      {isDataReady === undefined && <Loader dataTestId='nftsLoader' />}
      {isDataReady === false && (
        <PageState
          icon={faFileAlt}
          title='Unable to load Smart Contract'
          className='py-spacer my-auto'
          dataTestId='errorScreen'
        />
      )}
      {isDataReady === true && contract && (
        <div>
          <DappProvider
            environment={environment}
            customNetworkConfig={{
              name: 'sdk-sc-explorer',
              skipFetchFromServer: true,
              walletConnectV2ProjectId: 'a4bec75abca381546654ea6867a557db'
            }}
          >
            <TransactionsToastList />
            <NotificationModal />
            <SignTransactionsModals />
            <ScExplorerContainer
              smartContract={{
                canMutate: true,
                canLoadAbi: false,
                canDeploy: false,
                canUpgrade: false,
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
            />
          </DappProvider>
        </div>
      )}
    </>
  );
};
