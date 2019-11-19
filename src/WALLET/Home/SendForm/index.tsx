import * as React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import { validationSchema } from './validatorFunctions';

const initialValues = { dstAddress: '', amount: '', gasPrice: '', gasLimit: '', data: '' };

interface SendFormikType {
  economicsEnabled: boolean;
}

const SendFormik = ({ economicsEnabled }: SendFormikType) => {
  let ref = React.useRef(null);
  //   const dispatch = useWalletDispatch();

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
              <a href="#" className="float-right" ng-click="entireBalance()">
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
            <div className="form-group" ng-show="economicsEnabled">
              <label htmlFor="gasPrice">
                Gas Price (10{' '}
                <sup>
                  -{'{'}
                  {'{'} denominationValue {'}'}
                  {'}'}
                </sup>{' '}
                ERD)
              </label>
              <input
                type="text"
                className={
                  errors.gasPrice && touched.gasPrice ? 'form-control is-invalid' : 'form-control'
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
            <div className="form-group" ng-show="economicsEnabled">
              <label htmlFor="gasLimit">Gas Limit</label>
              <input
                type="text"
                className={
                  errors.gasLimit && touched.gasLimit ? 'form-control is-invalid' : 'form-control'
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
            <div className="form-group" ng-show="dataEnabled">
              <label htmlFor="amount">Data</label>
              <textarea
                className={errors.data && touched.data ? 'form-control is-invalid' : 'form-control'}
                id="data"
                name="data"
                placeholder="Data"
                value={values.data}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage component="div" name="data" className="invalid-feedback" />
            </div>
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
