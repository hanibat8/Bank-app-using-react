import React from 'react';
import { auth } from '../../firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useDatabaseUpdateMutation } from "@react-query-firebase/database";
import { ref } from "firebase/database";
import { db } from '../../firebase-config';
import SignUpFormView from '../view/SignUpFormView';

const SignUpController=()=>{
    
    const dbRef = ref(db, `users/`);
    const mutation = useDatabaseUpdateMutation(dbRef);
   
    const onSubmit=async(emailVal:string,passVal:string) => {
       return await createUserWithEmailAndPassword(auth,emailVal,passVal);
    };

    const addUserToDB=(uid:string,name:string) => {
        mutation.mutate({
           [uid]: {
            name:name.split('@')[0],
            balance:500,
            movements:[]
        }
    })};
    
    return(
        <SignUpFormView onSubmitHandler={onSubmit} addUserToDB={addUserToDB}/>
    )
}

export default SignUpController;