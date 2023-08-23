'use client';

import { useState } from 'react';
import { Container, TextField } from '@mui/material';
import { object as yupObject, string as yupString } from 'yup';
import { Formik, Form } from 'formik';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import { auth } from '@/utils/firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

interface ISignInValues {
  mobile: string,
  //password: string,
}

const defaultValues: ISignInValues = {
  mobile: '',
  // password: '',
};

const signinSchema = yupObject({
  mobile: yupString()
    .required('Please input your mobile number.'),
  // password: yupString()
  //   .required('Please input a valid password.')
  //   .min(8, 'Please input a password longer than 8 characters.'),
});

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)

  const onCaptchaVerify = () => {
    if (recaptchaVerifier) return recaptchaVerifier;

    const verifier = new RecaptchaVerifier(auth, 'sign-in-btn', { 'size': 'invisible' });
    console.log('----- NEW VERIFIER -----');
    console.log(verifier);
    setRecaptchaVerifier(verifier);
    return verifier
  };

  const firebaseSignInWithPhoneNumber = async (phoneNumber: string, appVerifier: any) => {
    const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    if (!result) throw result;

    // SMS sent. Prompt user to type the code from the message, then sign the
    // user in with confirmationResult.confirm(code).
    setConfirmationResult(result);
    return result
  };

  const handleSignIn = async (values: ISignInValues) => {
    try {
      setIsLoading(true);

      const verifier = onCaptchaVerify();

      const result = await firebaseSignInWithPhoneNumber(values.mobile, verifier);
      // TODO: Add proper alert components
      alert(`OTP sent to ${values.mobile}`);

      // TODO: Add proper modals
      let otp: string | null = ""
      do{
        otp = prompt('Please enter OTP');
      } while(!otp)

      const otpResult = await result.confirm(otp);
      console.log('----- OTP RESULT -----');
      console.log(otpResult);

      // TODO: Store use session
      alert('SUCCESSFULLY SIGNED IN!');
    } catch (error) {
      // TODO: Add error handler
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Formik
      initialValues={defaultValues}
      onSubmit={(values) => handleSignIn(values)}
      validateOnChange={true}
      validateOnBlur={true}
      validationSchema={signinSchema}
    >
      {({
          values,
          errors,
          touched,
          dirty,
          isValid,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
        <Container sx={{ pt: '1em' }}>
          <Form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name='mobile'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.mobile}
              error={touched.mobile && !!(errors.mobile)}
              label='Mobile Number'
              helperText={touched.mobile && errors.mobile}
            />

            {/*<TextField
              fullWidth
              name='password'
              type={'password'}
              autoComplete={'on'}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              error={touched.password && !!(errors.password)}
              label='Password'
              helperText={touched.password && errors.password}
            />*/}

            <LoadingButton
              type={'submit'}
              id={'sign-in-btn'}
              loading={isLoading}
              loadingPosition={'start'}
              startIcon={<Save />}
              variant={'contained'}
              disabled={!(isValid && dirty)}
            >
              Sign-in
            </LoadingButton>
          </Form>
        </Container>
      )}
    </Formik>
  );
}