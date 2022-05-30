import React,{useState} from 'react';
import Input from './InputView';
import classes from './SignUpFormView.module.css';
import {useNavigate,Link } from 'react-router-dom';
//import {renderResponseItem} from '../utils/util';
import LoadingSpinner from './LoadingSpinner';
import { Formik, Form } from "formik";
import * as Yup from "yup";

const SignUpFormView=(props:any)=>{
    const [error,setError]=useState(false);
    const navigate=useNavigate ();

    /*useEffect(()=>{
       // !error && !isLoading && response && authContext.logIn(response.idToken);
       response && authContext.logIn(response.idToken);   
       isLoggedIn && navigate('/');
    },[response,authContext,isLoggedIn])*/
 
    return(
        <React.Fragment>
            <Formik
            initialValues={{
                email: "",
                password:"",
                confirmPassword:""
            }}
            validationSchema={Yup.object({   
            password: Yup.string()
                .min(6, "Must be 6 characters or more")
                .required("Required"),
            confirmPassword: Yup.string()
                .min(6, "Must be 6 characters or more")
                .required("Required")
                .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            email: Yup.string()
                .email("Invalid email address`")
                .required("Required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
                 //unsetState();
                 /*sendRequest({
                    url:'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC3tkL__9PuUSI_bZBzyJIAjxda4AHOZog',
                    method:'POST',
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password,
                        returnSecureToken: true,
                      }),
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });*/
                    props.onSubmitHandler(values.email,values.password).then((userCredential:any) => {
                        //props.addUserToDB(userCredential.user.uid,values.email);
                        console.log(userCredential);
                        navigate('/home');
                      
                    }).catch((err:any)=>{
                        console.log('here');
                        setError(err.message);
                        
                    }).finally(()=>setSubmitting(false))
                
                }}>
                {formik => {
                    return (
                        <nav className={classes["nav"]}>
                            <h2 className={classes['nav__detail']}>Sign Up</h2>
                            <Form className={classes['form__login']}>
                                <Input 
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                
                                />
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder='Password' 
                                  
                                />
                                <Input
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"  
                                    
                                />
                                {(formik.isSubmitting) && <LoadingSpinner/>}
                                {(error) && <span className={classes['error']}>{error}</span>}
                                {!formik.isSubmitting && <button type="submit" disabled={!formik.isValid || formik.isSubmitting } className={classes['login__btn']}>Sign Up</button>}
                            </Form>
                            <Link to='/'>Have an account? Login</Link>
                        </nav>
                    )
                }
            }
        </Formik>
    </React.Fragment>
    )
}

export default SignUpFormView;