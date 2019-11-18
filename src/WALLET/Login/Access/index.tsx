import * as React from 'react';
import { string, object, mixed } from 'yup';
import { Formik, ErrorMessage } from 'formik';
import FileSaver from 'file-saver';
import cryptoCore from '../../lib/cryptoCore';

const accessWallet = function accessWallet(kdContent: object, accessPassVal: string) {
  let account;
  try {
    account = cryptoCore.loadAccountFromKeyFile(kdContent, accessPassVal);
  } catch (e) {
    console.warn(e);
    return;
  }

  if (!account.privateKey) {
    const accessPassError = 'Please check your uploaded file or your password';
    // angular.element('#accessPassInput').addClass('is-invalid');
    // angular.element('#accessWalletBtn').removeClass('active-btn');
    return;
  }

  //   localStorageDB.save(STORAGE_ACCOUNT_DATA, {
  //     privateKey: account.privateKey.toString('hex'),
  //     publicKey: account.publicKeyAsString(),
  //   });

  //   location.path('/mywallet/');
};

const initialValues = { password: '', walletFile: {} };

const PasswordFormik = () => (
  <Formik
    initialValues={initialValues}
    onSubmit={({ password, walletFile }, { setSubmitting, resetForm, setValues, setErrors }) => {
      accessWallet(walletFile, password);
      setSubmitting(false);
      resetForm();
      setValues({ password, walletFile });
    }}
    validationSchema={object().shape({
      password: string()
        .required('Required')
        .test('min', 'Please enter at least 9 characters', value => value && value.length >= 9),
      walletFile: mixed().required(),
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
        setFieldValue,
        handleSubmit,
      } = props;
      return (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="walletFile">Private Key</label>
            <fieldset>
              <div className="custom-file w-100">
                <input
                  type="file"
                  className="custom-file-input"
                  onChange={event => {
                    const fileReader = new FileReader();
                    fileReader.onload = function(e) {
                      try {
                        const walletContent = JSON.parse((e as any).target.value);
                        setFieldValue('walletFile', walletContent);
                      } catch (e) {
                        return;
                      }
                    };
                    if (event !== null)
                      fileReader.readAsText((event as any).currentTarget.files[0]);
                  }}
                  id="walletFile"
                  name="walletFile"
                  accept="application/json,.json"
                />
                <label className="custom-file-label" htmlFor="walletFile" id="walletFileLabel">
                  Choose file...
                </label>
              </div>
            </fieldset>
            <ErrorMessage component="div" name="walletFile" className="invalid-feedback" />
          </div>
          <div className="form-group">
            <label htmlFor="accessPassInput">Password</label>
            <input
              type="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              className={
                errors.password && touched.password ? 'form-control is-invalid' : 'form-control'
              }
            />
            <ErrorMessage component="div" name="password" className="invalid-feedback" />
          </div>
          <button type="submit" className="btn btn-primary" id="accessWalletBtn">
            Unlock Wallet
          </button>
        </form>
      );
    }}
  </Formik>
);

const AccessWallet = () => {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">Access My Wallet</h4>
        <p className="lead">Check balance, view public address or send ERD tokens.</p>
        <form ng-submit="accessNewWallet()"></form>
      </div>
    </div>
  );
};

export default AccessWallet;
