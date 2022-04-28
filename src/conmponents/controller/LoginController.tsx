import React from 'react';
import LoginFormView from '../view/LoginFormView';
import { signInWithEmailAndPassword } from "firebase/auth"
import {auth} from '../../firebase-config';

const LoginController=()=>{

    const onSubmit=async(emailVal:string,passVal:string) => {
       return await signInWithEmailAndPassword(auth,emailVal,passVal);
    };
    
    return(
        <LoginFormView onSubmitHandler={onSubmit}/>
    )
}

export default LoginController;