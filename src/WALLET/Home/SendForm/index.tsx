import * as React from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Accordion, ListGroup, Card } from 'react-bootstrap';
import { Denominate } from './../../../sharedComponents';
import { validationSchema, entireBalance } from './validatorFunctions';
import { useWalletState } from './../../context';
import { useGlobalState } from './../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const SendFormik = () => {
  let ref = React.useRef(null);
  const {
    activeTestnet: {
      economics,
      denomination,
      data,
      decimals,
      gasLimitEditable,
      gasLimit,
      gasPrice,
    },
  } = useGlobalState();
  const { balance } = useWalletState();

  const initialValues = { dstAddress: '', amount: '', gasPrice, gasLimit, data: '' };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting, resetForm, setValues, setErrors }) => {
        const { dstAddress, amount, gasPrice, gasLimit, data } = values;
        if (ref.current !== null) {
          // dispatch({ type: 'login', privateKey, publicKey });
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
          setErrors,
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
          const { gasLimit, gasPrice } = values;
          const newBalance = entireBalance({ balance, gasPrice, gasLimit, denomination, decimals });
          if (newBalance !== undefined) setFieldValue('amount', newBalance);
        };

        return (
          <form onSubmit={handleSubmit} ref={ref}>
            <div className="form-group">
              <a href="#" className="float-right" onClick={copyDstAddress}>
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
                required
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
                required
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="off"
              />
              <ErrorMessage component="div" name="amount" className="invalid-feedback" />
            </div>
            <Accordion className={economics ? '' : 'd-none'}>
              <div>
                <div>Transaction fee:</div>

                <Accordion.Toggle as={Card.Text} eventKey="0" style={{ marginBottom: '1rem' }}>
                  <label>
                    <Denominate value={(gasPrice * gasLimit).toString()} />
                    &nbsp;
                    <FontAwesomeIcon icon={faAngleDown} />
                  </label>
                </Accordion.Toggle>
              </div>

              <Accordion.Collapse eventKey="0">
                <fieldset
                  className="border p-2"
                  style={{
                    marginBottom: '1rem',
                    marginLeft: '-0.5rem',
                    width: '103%',
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="gasPrice">
                      Gas Price (10 <sup>-{denomination}</sup> ERD)
                    </label>
                    <input
                      type="text"
                      className={
                        errors.gasPrice && touched.gasPrice
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                      id="gasPrice"
                      name="gasPrice"
                      placeholder="Amount"
                      required
                      value={values.gasPrice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                    />
                    <ErrorMessage component="div" name="gasPrice" className="invalid-feedback" />
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
                      required
                      disabled={!gasLimitEditable}
                      value={values.gasLimit}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                    />
                    <ErrorMessage component="div" name="gasLimit" className="invalid-feedback" />
                  </div>
                </fieldset>
              </Accordion.Collapse>
            </Accordion>

            {data && (
              <div className="form-group">
                <label htmlFor="amount">Data</label>
                <textarea
                  className={
                    errors.data && touched.data ? 'form-control is-invalid' : 'form-control'
                  }
                  id="data"
                  name="data"
                  placeholder="Data"
                  value={values.data}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage component="div" name="data" className="invalid-feedback" />
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled id="sendTrxBtn">
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>
        );
      }}
    </Formik>
  );
};

export default SendFormik;
