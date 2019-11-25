import { ErrorMessage, Formik } from 'formik';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { object, string } from 'yup';
import cryptoCore from '../lib/cryptoCore';
import { useGlobalState } from './../../context';
import { useWalletDispatch } from './../context';

function convertNewWallet(kdContent: string) {
  let account;
  try {
    account = cryptoCore.loadAccountFromPEMSecret(kdContent);
    if (!account.privateKey) {
      return {
        success: false,
        privateKey: '',
        publicKey: '',
      };
    }
    return {
      success: true,
      privateKey: account.privateKeyAsString(),
      publicKey: account.publicKeyAsString(),
    };
  } catch (e) {
    return {
      success: false,
      privateKey: '',
      publicKey: '',
    };
  }
}

function hexStringToByte(str: string) {
  if (!str) {
    return new Uint8Array();
  }
  const a = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16));
  }
  return new Uint8Array(a);
}

const UnlockPemForm = withRouter(props => {
  const initialValues = { walletFile: '' };
  const dispatch = useWalletDispatch();
  const ref = React.useRef(null);
  const [fileName, setFileName] = React.useState('Choose file...');

  const { activeTestnetId } = useGlobalState();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={({ walletFile }, { setSubmitting, resetForm, setValues, setErrors }) => {
        const { success, privateKey, publicKey } = convertNewWallet(walletFile);
        if (success) {
          resetForm();
          setValues({ walletFile });
          dispatch({ type: 'login', privateKey, publicKey });
          if (activeTestnetId) {
            props.history.push(`/${activeTestnetId}`);
          } else {
            props.history.push(`/`);
          }
        } else {
          setErrors({ walletFile: 'Please check your uploaded file or your password' });
        }
        if (ref.current !== null) {
          setSubmitting(false);
        }
      }}
      validationSchema={object().shape({
        walletFile: string().required(),
      })}
    >
      {props => {
        const { isSubmitting, setFieldValue, setErrors, handleSubmit } = props;
        return (
          <form onSubmit={handleSubmit} ref={ref}>
            <div className="form-group">
              <label htmlFor="walletFile">Private Key</label>
              <fieldset>
                <div className="custom-file w-100">
                  <input
                    type="file"
                    id="walletFile"
                    name="walletFile"
                    accept=".pem"
                    className="custom-file-input"
                    onChange={event => {
                      const fileReader = new FileReader();
                      fileReader.onload = function onload(e) {
                        try {
                          const regex = /-----/gi;
                          let result;
                          const indices = [];
                          // tslint:disable-next-line
                          while ((result = regex.exec(fileReader.result!.toString()))) {
                            indices.push(result.index);
                          }

                          const key = fileReader
                            .result!.toString()
                            .substring(indices[1] + 6, indices[2] - 1);
                          const decoded = window.atob(key);
                          setFieldValue('walletFile', hexStringToByte(decoded));
                        } catch (e) {
                          setErrors({ walletFile: 'Please load a valid account file' });
                          return;
                        }
                      };
                      if (event !== null) {
                        const { name } = (event as any).currentTarget.files[0];
                        setFileName(name);
                        fileReader.readAsText((event as any).currentTarget.files[0]);
                      }
                    }}
                  />
                  <label
                    className="custom-file-label"
                    data-testid="uploadLabel"
                    htmlFor="walletFile"
                    id="walletFileLabel"
                  >
                    {fileName}
                  </label>
                </div>
              </fieldset>
              <ErrorMessage component="div" name="walletFile" className="invalid-feedback" />
            </div>
            <div className="form-group">
              <small className="form-text text-muted" id="remember">
                <span className="text-danger">Remember:</span> You'll need this password &amp;
                keystore file to unlock your wallet
              </small>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                id="accessWalletBtn"
              >
                {!isSubmitting ? 'Unlock Wallet' : 'Unlocking Wallet...'}
              </button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
});

const UnlockPem = () => {
  return (
    <div className="row row-eq-height">
      <div className="offset-xl-3 col-xl-6 offset-lg-3 col-lg-6 mt-4 mb-4">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Access using PEM</h4>
            <p className="lead">
              Although not recommended, this allows you to unlock the wallet using your private key.
            </p>
            <UnlockPemForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockPem;
