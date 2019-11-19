import * as React from 'react';
import { Formik, ErrorMessage } from 'formik';
import { validationSchema, entireBalance } from './validatorFunctions';
import { useWalletState } from './../../context';
import { useGlobalState } from './../../../context';

const initialValues = { dstAddress: '', amount: '', gasPrice: 10, gasLimit: 100, data: '' };

const SendFormik = () => {
  let ref = React.useRef(null);
  const {
    activeTestnet: { economics, denomination, data, decimals },
  } = useGlobalState();
  const { balance } = useWalletState();

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
          setFieldValue('amount', newBalance);
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
            {economics && (
              <>
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
                    value={values.gasLimit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                  <ErrorMessage component="div" name="gasLimit" className="invalid-feedback" />
                </div>
              </>
            )}
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
