'use client';

import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { object as yupObject, string as yupString } from 'yup';
import { Formik, Form } from 'formik';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';
import { auth } from '@/utils/firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

interface ISignInValues {
  mobile: string,
}

const defaultValues: ISignInValues = {
  mobile: '',
};

const signinSchema = yupObject({
  mobile: yupString()
    .required('Please input your mobile number.'),
});

function Copyright(props: any) {
  return (
    <Typography variant='body2' color='text.secondary' align='center' {...props}>
      {'Copyright © '}
      <Link color='inherit' href='https://mui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn() {
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

  // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };

  // if ()

  return (
    <ThemeProvider theme={defaultTheme}>
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

          <Container component='main' maxWidth='xs'>
            <Form onSubmit={handleSubmit}>
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>

                <Typography component='h1' variant='h5'>
                  Sign in
                </Typography>

                <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mobile}
                    error={touched.mobile && !!(errors.mobile)}
                    label='Mobile Number'
                    helperText={touched.mobile && errors.mobile}
                    name='mobile'
                    autoFocus
                  />

                  <FormControlLabel
                    control={<Checkbox value='remember' color='primary' />}
                    label='Remember me'
                  />

                  <LoadingButton
                    type='submit'
                    fullWidth
                    loading={isLoading}
                    loadingPosition={'start'}
                    startIcon={<Save />}
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                    disabled={!(isValid && dirty)}
                  >
                    Sign In
                  </LoadingButton>

                  <Grid container>
                    <Grid item xs>
                      <Link href='#' variant='body2'>
                        Forgot password?
                      </Link>
                    </Grid>

                    <Grid item>
                      <Link href='#' variant='body2'>
                        {'Don\'t have an account? Sign Up'}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Form>

            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
        )}
      </Formik>
    </ThemeProvider>
  );
}