import React,{useState} from 'react';
import Input from './InputView';
import classes from './LoginFormView.module.css';
import {useNavigate,Link } from 'react-router-dom';
//import {renderResponseItem} from '../utils/util';
import { Formik, Form } from "formik";
import * as Yup from "yup";

const LoginFormView=(props:any)=>{
    const [error,setError]=useState(false);
    const navigate=useNavigate ();
 
    return(
        <React.Fragment>
            <Formik
            initialValues={{
                email: "",
                password:""
            }}
            validationSchema={Yup.object({
            email: Yup.string()
                .email("Invalid email addresss`")
                .required("Required"),
            password: Yup.string()
                .min(6, "Must be 5 characters or more")
                .required("Required"),
            })}
            onSubmit={async(values, { setSubmitting }) => {
                props.onSubmitHandler(values.email,values.password).then((userCredential:any)=>{
                    //console.log(userCredential);
                    setSubmitting(false);
                    //console.log(props)
                    //props.isLoanPending(userCredential.data.uid)
                    //authContext.isLoggedIn=true;
                    //authContext.logIn(userCredential._tokenResponse.idToken);
                    navigate('/home');
                }).catch((err:any)=>{
                    setError(err.message);
                })
                
                }}>
                {formik => {
                    return (
                        <nav className={classes["nav"]}>
                            <h2 className={classes['nav__detail']}>
                                Log in to get started
                            </h2>      
                            <Form action="" className={classes['form__login']}>
                                <div>
                                    <Input 
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        />
                                    <Input
                                        label="Password"
                                        name="password"
                                        type="password"       
                                    />
                                    {(formik.isSubmitting || error) /*&& renderResponseItem(formik.isSubmitting,error)*/}
                                    {!formik.isSubmitting && <button type="submit" disabled={!formik.isValid || formik.isSubmitting} className={classes['login__btn']}>Login</button>}
                                </div>
                            </Form>
                            <Link to='/signUp'>Don't have an account? Sign Up</Link>
                        </nav>
                    )
                }
            }
        </Formik>
    </React.Fragment>
    )
}

export default LoginFormView;