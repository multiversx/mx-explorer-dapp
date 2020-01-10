import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Formik } from 'formik';
import { copyToClipboard } from 'helpers';
import * as React from 'react';
import { Denominate } from 'sharedComponents';
import { sendTransaction } from './../helpers/asyncRequests';
import { PopulateDetailsType } from './../WalletHeader';
import FailedTransaction from './FailedTransaction';
import { entireBalance, prepareTransaction, validationSchema } from './validatorFunctions';

interface SendFormDataType {
  testnetGasLimit: number;
  economics?: boolean;
  dispatch: (props: any) => void;
  testnetGasPrice: number;
  gasPerDataByte: number;
  balance: string;
  serverBalance: string;
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
  gasPerDataByte,
  balance,
  publicKey,
  privateKey,
  dispatch,
  nodeUrl,
  nonce,
  timeout,
  gasLimitEditable,
  populateDetails,
  data,
  decimals,
}: SendFormDataType & PopulateDetailsType) => {
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
  const [gasDetailsVisible, setGasDetailsVisible] = React.useState(false);

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
              const getNewBalance = () => {
                populateDetails(intervalId)();
              };

              if (success) {
                dispatch({ type: 'setNonce', nonce: nonce + 1 });
                dispatch({ type: 'setLastTxHash', lastTxHash });
                dispatch({ type: 'setBalance', balance: newBalance });
                intervalId = setInterval(getNewBalance, 2000);
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
          copyToClipboard(values.dstAddress);
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

        const changeGasLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
          setFieldValue('gasLimit', parseInt(e.target.value ? e.target.value : '0'), true);
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
                  data-testid="dstAddress"
                  placeholder="Address"
                  required={true}
                  value={values.dstAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                />
                <ErrorMessage
                  component="div"
                  name="dstAddress"
                  data-testid="dstAddressError"
                  className="invalid-feedback"
                />
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
              <div>
                <div>Fee limit</div>
                <label onClick={() => setGasDetailsVisible(!gasDetailsVisible)}>
                  <span data-testid="transactionFeeValue">
                    <Denominate value={(testnetGasPrice * values.gasLimit).toString()} />
                  </span>
                  &nbsp;
                  {gasDetailsVisible ? (
                    <FontAwesomeIcon icon={faAngleUp} />
                  ) : (
                    <FontAwesomeIcon icon={faAngleDown} />
                  )}
                </label>
              </div>
              <div className={gasDetailsVisible ? '' : 'd-none'}>
                <div className="card card-body bg-light mb-2">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label text-right">Gas Price</label>
                    <p className="col-sm-9 col-form-label">
                      <Denominate value={testnetGasPrice.toString()} />
                    </p>
                  </div>
                  <div className="form-group row" style={{ marginBottom: '0.5rem' }}>
                    <label className="col-sm-3 col-form-label text-right" htmlFor="gasLimit">
                      Gas Limit
                    </label>
                    <div className="col-sm-9">
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
                        onChange={changeGasLimit}
                        onBlur={handleBlur}
                        autoComplete="off"
                      />
                      <ErrorMessage component="div" name="gasLimit" className="invalid-feedback" />
                    </div>
                    <div className="col-sm-12" />
                  </div>
                </div>
              </div>

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
                    setFieldValue(
                      'gasLimit',
                      testnetGasLimit +
                        (e.target.value ? e.target.value.length * gasPerDataByte : 0),
                      false
                    );
                    setFieldValue('data', e.target.value, false);
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
