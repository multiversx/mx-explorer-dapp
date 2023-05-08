import React, { useEffect, useRef, useState } from 'react';
import { faFileAlt } from '@fortawesome/pro-solid-svg-icons/faFileAlt';
import { Tab, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useMatch, useNavigate } from 'react-router-dom';

import { Loader, PageState } from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter, useNetworkRoute } from 'hooks';
import { accountSelector } from 'redux/selectors';
import { accountsRoutes } from 'routes';
import { VerifiedContractType } from 'types';

import { ContractCode } from './components/ContractCode';
import { ContractConstructor } from './components/ContractConstructor';
import { ContractEndpoints } from './components/ContractEndpoints';
import { ContractEvents } from './components/ContractEvents';
import { ContractTypes } from './components/ContractTypes';

export enum VerifiedContractTabsEnum {
  details = 'details',
  contractconstructor = 'contract-constructor',
  endpoints = 'endpoints',
  events = 'events',
  types = 'types'
}

export const AccountVerifiedContract = () => {
  const ref = useRef(null);
  const networkRoute = useNetworkRoute();
  const navigate = useNavigate();

  let activeSection: VerifiedContractTabsEnum =
    VerifiedContractTabsEnum.details;

  if (useMatch(networkRoute(accountsRoutes.accountCodeEndpoints))) {
    activeSection = VerifiedContractTabsEnum.endpoints;
  }
  if (useMatch(networkRoute(accountsRoutes.accountCodeConstructor))) {
    activeSection = VerifiedContractTabsEnum.contractconstructor;
  }
  if (useMatch(networkRoute(accountsRoutes.accountCodeEvents))) {
    activeSection = VerifiedContractTabsEnum.events;
  }
  if (useMatch(networkRoute(accountsRoutes.accountCodeTypes))) {
    activeSection = VerifiedContractTabsEnum.types;
  }

  const { getAccountContractVerification } = useAdapter();
  const { account } = useSelector(accountSelector);
  const { address, isVerified } = account;

  const [contract, setContract] = useState<VerifiedContractType>();
  const [isDataReady, setIsDataReady] = useState<undefined | boolean>();
  const [activeKey, setActiveKey] =
    useState<VerifiedContractTabsEnum>(activeSection);

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

  if (!isVerified) {
    return null;
  }

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
        <div className='verified-contract'>
          <Tab.Container
            id='contract-code-tabs'
            defaultActiveKey={activeKey}
            onSelect={(selectedKey) => {
              return selectedKey
                ? setActiveKey(selectedKey as VerifiedContractTabsEnum)
                : 'details';
            }}
          >
            <div className='card-header pt-0'>
              <div className='card-header-item d-flex align-items-center'>
                <div className='tabs'>
                  <Nav.Link
                    data-testid='title'
                    eventKey='details'
                    className={`tab ${activeKey === 'details' ? 'active' : ''}`}
                    onClick={() => {
                      const options = {
                        pathname: networkRoute(
                          urlBuilder.accountDetailsContractCode(address)
                        )
                      };
                      navigate(options, { replace: true });
                    }}
                  >
                    Code
                  </Nav.Link>

                  {contract.source.abi?.endpoints && (
                    <Nav.Link
                      eventKey='endpoints'
                      className={`tab ${
                        activeKey === 'endpoints' ? 'active' : ''
                      }`}
                      onClick={() => {
                        const options = {
                          pathname: networkRoute(
                            urlBuilder.accountDetailsContractCodeEndpoints(
                              address
                            )
                          )
                        };
                        navigate(options, { replace: true });
                      }}
                    >
                      Endpoints
                    </Nav.Link>
                  )}

                  {contract.source.abi?.events && (
                    <Nav.Link
                      eventKey='events'
                      className={`tab ${
                        activeKey === 'events' ? 'active' : ''
                      }`}
                      onClick={() => {
                        const options = {
                          pathname: networkRoute(
                            urlBuilder.accountDetailsContractCodeEvents(address)
                          )
                        };
                        navigate(options, { replace: true });
                      }}
                    >
                      Events
                    </Nav.Link>
                  )}

                  {contract.source.abi?.types && (
                    <Nav.Link
                      eventKey='types'
                      className={`tab ${activeKey === 'types' ? 'active' : ''}`}
                      onClick={() => {
                        const options = {
                          pathname: networkRoute(
                            urlBuilder.accountDetailsContractCodeTypes(address)
                          )
                        };
                        navigate(options, { replace: true });
                      }}
                    >
                      Types
                    </Nav.Link>
                  )}
                  {contract.source.abi?.['constructor'] && (
                    <Nav.Link
                      eventKey='contract-constructor'
                      className={`tab ${
                        activeKey === 'contract-constructor' ? 'active' : ''
                      }`}
                      onClick={() => {
                        const options = {
                          pathname: networkRoute(
                            urlBuilder.accountDetailsContractCodeConstructor(
                              address
                            )
                          )
                        };
                        navigate(options, { replace: true });
                      }}
                    >
                      Constructor
                    </Nav.Link>
                  )}
                </div>
                <h3 className='mb-0 ms-3 text-neutral-400'>(Beta)</h3>
              </div>
            </div>

            <div className='card-body pb-0'>
              <Tab.Content>
                <Tab.Pane eventKey='details'>
                  <ContractCode contract={contract} />
                </Tab.Pane>
                {contract.source.abi?.endpoints && (
                  <Tab.Pane eventKey='endpoints'>
                    <ContractEndpoints contract={contract} />
                  </Tab.Pane>
                )}
                {contract.source.abi?.events && (
                  <Tab.Pane eventKey='events'>
                    <ContractEvents contract={contract} />
                  </Tab.Pane>
                )}
                {contract.source.abi?.types && (
                  <Tab.Pane eventKey='types'>
                    <ContractTypes contract={contract} />
                  </Tab.Pane>
                )}
                {contract.source.abi?.['constructor'] && (
                  <Tab.Pane eventKey='contract-constructor'>
                    <ContractConstructor contract={contract} />
                  </Tab.Pane>
                )}
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      )}
    </>
  );
};
