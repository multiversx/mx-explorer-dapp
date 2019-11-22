import FileSaver from 'file-saver';
import { ErrorMessage, Formik } from 'formik';
import * as React from 'react';
import { object, string } from 'yup';
import cryptoCore from '../../lib/cryptoCore';

const createNewWallet = async function createNewWallet(password: string) {
  const [account, kd] = cryptoCore.newAccount(password);
  const blob = new Blob([JSON.stringify(kd)], { type: 'application/json; charset=utf-8' });
  FileSaver.saveAs(blob, account.publicKeyAsString() + '.json');
};

const initialValues = { password: '' };

const PasswordFormik = () => (
  <Formik
    initialValues={initialValues}
    onSubmit={({ password }, { setSubmitting, resetForm, setValues }) => {
      createNewWallet(password);
      setSubmitting(false);
      resetForm();
      setValues({ password });
    }}
    validationSchema={object().shape({
      password: string()
        .required('Required')
        .test('min', 'Please enter at least 9 characters', value => value && value.length >= 9),
    })}
  >
    {props => {
      const {
        values,
        touched,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
      } = props;
      return (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              placeholder="At least 9 characters"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              className={
                errors.password && touched.password ? 'form-control is-invalid' : 'form-control'
              }
            />
            <ErrorMessage component="div" name="password" className="invalid-feedback" />
            <small className="form-text text-muted" id="remember">
              <span className="text-danger">Remember:</span> You'll need this password &amp;
              keystore file to unlock your wallet
            </small>
          </div>
          <div className="form-group">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              id="createWalletBtn"
            >
              {!isSubmitting ? 'Create Wallet' : 'Creating Wallet...'}
            </button>
          </div>
        </form>
      );
    }}
  </Formik>
);

const CreateWallet = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title" data-testid="createNewWalletTitle">
          Create New Wallet
        </h4>
        <p className="lead">Start by creating a wallet if you don't already have one.</p>
        <PasswordFormik />
      </div>
    </div>
  );
};

export default CreateWallet;
