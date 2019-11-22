import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Formik } from 'formik';
import * as React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { Denominate } from './../../../sharedComponents';
import { getWalletDetails, sendTransaction } from './../helpers/asyncRequests';
import FailedTransaction from './FailedTransaction';
import { entireBalance, prepareTransaction, validationSchema } from './validatorFunctions';

export interface SendFormikType {
  populateDetails: () => void;
}

interface SendFormDataType {
  testnetGasLimit: number;
  economics?: boolean;
  dispatch: (props: any) => void;
  testnetGasPrice: number;
  balance: string;
  publicKey: string;
  privateKey: string;
  denomination: number;
  nonce: number;
  nodeUrl: string;
  timeout: number;
  data?: boolean;
  gasLimitEditable?: boolean;
  decimals: number;
}

const SendFormik = ({
  testnetGasLimit,
  denomination,
  economics,
  testnetGasPrice,
  balance,
  publicKey,
  privateKey,
  dispatch,
  nodeUrl,
  nonce,
  timeout,
  gasLimitEditable,
  data,
  decimals,
}: SendFormDataType) => {
  const ref = React.useRef(null);
  // const { balance } = useWalletState();

  const initialValues = {
    dstAddress: '',
    amount: '',
    gasLimit: testnetGasLimit,
    data: '',
    // values uses for formatting, not present in inputs
    testnetGasLimit,
    denomination,
    balance,
    economics,
    testnetGasPrice,
  };

  const [failedTransaction, setFailedTransaction] = React.useState(false);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={(values, { setSubmitting, resetForm, setValues }) => {
        if (ref.current !== null) {
          const { amount, dstAddress, data, gasLimit } = values;
          const { transaction, newBalance } = prepareTransaction({
            balance,
            amount,
            gasLimit,
            gasPrice: testnetGasPrice,
            publicKey,
            privateKey,
            denomination,
            data,
            dstAddress,
            nonce,
          });
          sendTransaction({ nodeUrl, transaction, timeout, nonce }).then(
            ({ success, lastTxHash }) => {
              let intervalId: any = null;
              const getNewBalance = (oldBalance: string) => () => {
                getWalletDetails({
                  publicKey,
                  nodeUrl,
                  timeout,
                }).then(({ balance, nonce }) => {
                  if (balance !== oldBalance) {
                    dispatch({ type: 'setBalance', balance });
                    dispatch({ type: 'setNonce', nonce });
                    clearInterval(intervalId);
                  }
                });
              };

              if (success) {
                dispatch({ type: 'setNonce', nonce: nonce + 1 });
                dispatch({ type: 'setLastTxHash', lastTxHash });
                dispatch({ type: 'setBalance', balance: newBalance });
                intervalId = setInterval(getNewBalance(values.balance), 2000);
              } else {
                setFailedTransaction(true);
              }
            }
          );

          setSubmitting(false);
          resetForm();
          setValues(values);
        }
      }}
      validationSchema={validationSchema}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
        } = props;

        const copyDstAddress = (e: React.SyntheticEvent) => {
          e.preventDefault();
          navigator.clipboard.writeText(values.dstAddress);
        };

        const getEntireBalance = (e: React.SyntheticEvent) => {
          e.preventDefault();
          const { gasLimit } = values;
          const newBalance = entireBalance({
            balance,
            gasPrice: testnetGasPrice,
            gasLimit,
            denomination,
            decimals,
          });
          if (newBalance !== undefined) {
            setFieldValue('amount', newBalance);
          }
        };

        return (
          <form onSubmit={handleSubmit} ref={ref} className="h-100">
            <div className={failedTransaction ? 'd-none' : ''}>
              <div className="form-group">
                <a href="/#" className="float-right" onClick={copyDstAddress}>
                  <small>Copy</small>
                </a>
                <label htmlFor="dstAddress">To</label>
                <input
                  type="text"
                  className={
                    errors.dstAddress && touched.dstAddress
                      ? 'form-control is-invalid'
                      : 'form-control'
                  }
                  id="dstAddress"
                  name="dstAddress"
                  placeholder="Address"
                  required={true}
                  value={values.dstAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                />
                <ErrorMessage component="div" name="dstAddress" className="invalid-feedback" />
              </div>
              <div className="form-group">
                <a href="/#" className="float-right" onClick={getEntireBalance}>
                  <small>Entire balance</small>
                </a>
                <label htmlFor="amount">Amount (ERD)</label>
                <input
                  type="text"
                  className={
                    errors.amount && touched.amount ? 'form-control is-invalid' : 'form-control'
                  }
                  id="amount"
                  name="amount"
                  placeholder="Amount"
                  required={true}
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                />
                <ErrorMessage component="div" name="amount" className="invalid-feedback" />
              </div>
              <Accordion className={economics ? '' : 'd-none'}>
                <div>
                  <div>Transaction fee</div>
                  <Accordion.Toggle as={Card.Text} eventKey="0" style={{ marginBottom: '1rem' }}>
                    <label>
                      <span data-testid="transactionFeeValue">
                        <Denominate value={(testnetGasPrice * values.gasLimit).toString()} />
                      </span>
                      &nbsp;
                      <FontAwesomeIcon icon={faAngleDown} />
                    </label>
                  </Accordion.Toggle>
                </div>

                <Accordion.Collapse eventKey="0">
                  <div style={{ marginBottom: '1rem' }}>
                    <hr />
                    <div>
                      <div>Gas price</div>
                      <label>
                        <Denominate value={testnetGasPrice.toString()} />
                      </label>
                    </div>
                    <div className="form-group">
                      <label htmlFor="gasLimit">Gas Limit</label>
                      <input
                        type="text"
                        className={
                          errors.gasLimit && touched.gasLimit
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        id="gasLimit"
                        name="gasLimit"
                        placeholder="Amount"
                        required={true}
                        disabled={!gasLimitEditable}
                        value={values.gasLimit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                      />
                      <ErrorMessage component="div" name="gasLimit" className="invalid-feedback" />
                    </div>
                    <hr className="mt-4" />
                  </div>
                </Accordion.Collapse>
              </Accordion>
              <div className={data ? 'form-group' : 'd-none'}>
                <label htmlFor="data">Data</label>
                <textarea
                  className={
                    errors.data && touched.data ? 'form-control is-invalid' : 'form-control'
                  }
                  id="data"
                  name="data"
                  placeholder="Data"
                  value={values.data}
                  onChange={e => {
                    setFieldValue('data', e.target.value);
                    setFieldValue(
                      'gasLimit',
                      testnetGasLimit + (e.target.value ? e.target.value.length : 0),
                      false
                    );
                  }}
                  onBlur={handleBlur}
                />
                <ErrorMessage component="div" name="data" className="invalid-feedback" />
              </div>
              <button type="submit" className="btn btn-primary" id="sendTrxBtn">
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
            {failedTransaction && <FailedTransaction setFailedTransaction={setFailedTransaction} />}
          </form>
        );
      }}
    </Formik>
  );
};

export default SendFormik;
