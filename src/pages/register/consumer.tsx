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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { object as yupObject, string as yupString, date as yupDate } from 'yup';
import { Formik, Form } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import Save from '@mui/icons-material/Save';
import { auth } from '@/utils/firebase.config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import dayjs from 'dayjs';

interface IRegister {
  firstName: string,
  lastName: string,
  mobile: string,
  birthDate: Date,
}

const defaultValues: IRegister = {
  firstName: '',
  lastName: '',
  mobile: '',
  birthDate: dayjs().toDate(),
};

const registrationSchema = yupObject({
  firstName: yupString()
    .required('Please input a first name.'),
  lastName: yupString()
    .required('Please input a last name.'),
  mobile: yupString()
    .required('Please input your mobile number.'),
  birthDate: yupDate()
    .max(
      dayjs(),
      'Please input a date earlier than current date.',
    )
    .required('Please input your birth date.'),
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

export default function RegisterConsumer() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const onCaptchaVerify = () => {
    if (recaptchaVerifier) return recaptchaVerifier;

    const verifier = new RecaptchaVerifier(auth, 'sign-in-btn', { 'size': 'invisible' });
    console.log('----- NEW VERIFIER -----');
    console.log(verifier);
    setRecaptchaVerifier(verifier);
    return verifier;
  };

  const firebaseSignInWithPhoneNumber = async (phoneNumber: string, appVerifier: any) => {
    const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    if (!result) throw result;

    // SMS sent. Prompt user to type the code from the message, then sign the
    // user in with confirmationResult.confirm(code).
    setConfirmationResult(result);
    return result;
  };

  const handleRegister = async (values: IRegister) => {
    try {
      setIsLoading(true);

      const verifier = onCaptchaVerify();

      const result = await firebaseSignInWithPhoneNumber(values.mobile, verifier);
      // TODO: Add proper alert components
      alert(`OTP sent to ${values.mobile}`);

      // TODO: Add proper modals
      let otp: string | null = '';
      do {
        otp = prompt('Please enter OTP');
      } while (!otp);

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
      onSubmit={(values) => handleRegister(values)}
      validateOnChange={true}
      validateOnBlur={true}
      validationSchema={registrationSchema}
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
          setFieldValue,
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
                Sign Up
              </Typography>

              <Box component='div' sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.firstName}
                      error={touched.firstName && !!(errors.firstName)}
                      label='First Name'
                      helperText={touched.firstName && errors.firstName}
                      name='firstName'
                      autoFocus
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin='normal'
                      required
                      fullWidth
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.lastName}
                      error={touched.lastName && !!(errors.lastName)}
                      label='Last Name'
                      helperText={touched.lastName && errors.lastName}
                      name='lastName'
                      autoFocus
                    />
                  </Grid>

                  <Grid item xs={12}>
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
                  </Grid>

                  <Grid item xs={12}>
                    <DatePicker
                      value={dayjs(values.birthDate) ?? Date.now()}
                      onChange={(val: any) => setFieldValue('birthDate', val, true)}
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                          value: dayjs(values.birthDate) ?? Date.now(),
                          name: 'birthDate',
                          label: 'Birthday',
                          onBlur: handleBlur,
                          error: touched?.birthDate && !!(errors?.birthDate),
                          helperText: 'MM/DD/YYYY',
                        },
                      }}
                    />
                  </Grid>
                </Grid>

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
                  Sign Up
                </LoadingButton>
              </Box>
            </Box>
          </Form>

          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      )}
    </Formik>
  );
}
