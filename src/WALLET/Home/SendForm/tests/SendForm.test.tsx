import { fireEvent, render } from '@testing-library/react';
import { Field } from 'formik';
import React from 'react';
import SendForm from '../SendForm';
import { GlobalProvider } from './../../../../context';

const InputField = props => {
  return (
    <Field
      name={props.fieldName}
      render={({ field, form }) => (
        <div>
          <label htmlFor={props.fieldName}>{props.labelName}</label>
          <input {...field} id={props.fieldName} type="text" />
          {form.errors[props.fieldName] && form.touched[props.fieldName] ? (
            <div data-testid={`errors-${props.fieldName}`}>{form.errors[props.fieldName]}</div>
          ) : null}
        </div>
      )}
    />
  );
};

// test('sample form test', async () => {
//   const fieldName = 'firstName';
//   const labelName = 'First Name';
//   const initialValues = {
//     firstName: '',
//   };
//   const { getByLabelText, findByTestId } = render(
//     <Formik
//       initialValues={initialValues}
//       onSubmit={() => null}
//       validate={values => {
//         const errors = {
//           firstName: '',
//         };

//         if (!values.firstName) {
//           errors.firstName = 'Required.';
//         }

//         return errors;
//       }}
//     >
//       <InputField fieldName={fieldName} labelName={labelName} />
//     </Formik>
//   );

//   const input = getByLabelText(labelName);

//   // Call blur without inputting anything which should trigger a validation error
//   fireEvent.blur(input);

//   const validationErrors = await findByTestId(`transactionFeeValue`);

//   expect(validationErrors.innerHTML).toBe('Required.');
// });

const formProps = {
  testnetGasLimit: 1000,
  economics: true,
  testnetGasPrice: 10,
  publicKey: '39e82d234b7c73c34f76091818f2c9f68d93914d12f3e0c507c59a9d3e38ad29',
  privateKey: '39e82d234b7c73c34f76091818f2c9f68d93914d12f3e0c507c59a9d3e38ad29',
  denomination: 4,
  nonce: 0,
  nodeUrl: 'https://wallet-api.elrond.com',
  timeout: 3000,
  data: true,
  gasLimitEditable: true,
  decimals: 4,
  balance: '1000',
  dispatch: () => null,
};

// file upload
// https://github.com/testing-library/react-testing-library/issues/93#issuecomment-405111391
// https://codesandbox.io/s/rl0wj028pp

test('data changes transaction fee', async () => {
  const data = { target: { value: 'four' } };
  const dataLength = data.target.value.length;

  const { getByLabelText, findByTestId } = render(
    <GlobalProvider>
      <SendForm {...formProps} />
    </GlobalProvider>
  );

  const input = getByLabelText('Data');
  fireEvent.change(input, data);
  // Call blur without inputting anything which should trigger a validation error
  //   fireEvent.blur(input);

  const validationErrors = await findByTestId(`transactionFeeValue`);

  expect(validationErrors.innerHTML).toBe(`1.00${dataLength}0&nbsp;ERD`);
});
