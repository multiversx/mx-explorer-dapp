import React, { useState } from 'react';
import { faFileAlt } from '@fortawesome/pro-solid-svg-icons/faFileAlt';
import { Tab, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useMatch } from 'react-router-dom';

import { useAdapter, Loader, PageState } from 'components';
import { downloadFile, urlBuilder } from 'helpers';
import { useNetworkRoute } from 'hooks';

import { accountSelector } from 'redux/selectors';

import { accountsRoutes } from 'routes';
import { VerifiedContractType } from 'types';

import { ContractCode } from './components/ContractCode';

export const VerifiedContract = () => {
  const ref = React.useRef(null);
  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();

  const matchEndpoints: any = useMatch(
    networkRoute(accountsRoutes.accountCodeEndpoints)
  );
  const activeSection = matchEndpoints ? 'endpoints' : 'details';

  const [activeKey, setActiveKey] = React.useState(activeSection);

  const { getAccountContractVerification } = useAdapter();
  const { account } = useSelector(accountSelector);
  const { codeHash, code, address, isVerified } = account;

  const codeHashBase64Buffer = Buffer.from(String(codeHash ?? ''), 'base64');
  const codeHashHexValue = codeHashBase64Buffer.toString('hex');

  const [contract, setContract] = useState<VerifiedContractType>();
  const [isDataReady, setIsDataReady] = useState<undefined | boolean>();

  const fetchContractVerification = () => {
    getAccountContractVerification({ address }).then(({ success, data }) => {
      if (success && data) {
        setContract(data);
      }
      setIsDataReady(success);
    });
  };

  React.useEffect(() => {
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
        <div className='mt-3 verified-contract'>
          <Tab.Container
            id='contract-code-tabs'
            defaultActiveKey={activeKey}
            onSelect={(selectedKey) => {
              return selectedKey ? setActiveKey(selectedKey) : 'details';
            }}
          >
            <div className='card-header'>
              <div className='card-header-item d-flex align-items-center'>
                <div className='tab-links d-flex flex-row flex-wrap'>
                  <Nav.Link
                    data-testid='title'
                    eventKey='details'
                    className={`tab-link me-3 me-lg-4 ${
                      activeKey === 'details' ? 'active' : ''
                    }`}
                    onClick={() => {
                      window.history.replaceState(
                        null,
                        '',
                        urlBuilder.accountDetailsContractCode(address)
                      );
                    }}
                  >
                    <h5>Code</h5>
                  </Nav.Link>

                  <Nav.Link
                    eventKey='endpoints'
                    className={`tab-link me-3 me-lg-4 ${
                      activeKey === 'endpoints' ? 'active' : ''
                    }`}
                    onClick={() => {
                      window.history.replaceState(
                        null,
                        '',
                        urlBuilder.accountDetailsContractCodeEndpoints(address)
                      );
                    }}
                  >
                    <h5>Endpoints</h5>
                  </Nav.Link>
                </div>
              </div>
            </div>

            <div className='card-body pb-0'>
              <Tab.Content>
                <Tab.Pane eventKey='details'>
                  <ContractCode contract={contract} />
                </Tab.Pane>
                <Tab.Pane eventKey='endpoints'>Endpoints</Tab.Pane>
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      )}
    </>
  );
};
