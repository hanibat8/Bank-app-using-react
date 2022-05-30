import React from 'react';
import { auth } from '../../firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useDatabaseUpdateMutation } from "@react-query-firebase/database";
import { ref } from "firebase/database";
import { db } from '../../firebase-config';
import SignUpFormView from '../view/SignUpFormView';
import LoadingSpinner from '../view/LoadingSpinner';

const SignUpController=()=>{
    
    const dbRef = ref(db, `users/`);
    const mutation = useDatabaseUpdateMutation(dbRef);

    const addUserToDB=(uid:string,name:string|null) => {
        mutation.mutate({
           [uid]: {
            name:name?.split('@')[0],
            balance:500,
            movements:[]
        }
    })};
   
    const onSubmit=async(emailVal:string,passVal:string) => {
       return createUserWithEmailAndPassword(auth,emailVal,passVal).then((data)=>{
                                                                        console.log(data)
                                                                        addUserToDB(data.user.uid,data.user.email)})
                                                                    .catch((err)=>{throw err});
    };

    console.log(mutation);

    if(mutation?.isLoading){
        console.log('here');
        return <LoadingSpinner/>
    }
    
    return(
        <SignUpFormView onSubmitHandler={onSubmit} addUserToDB={addUserToDB}/>
    )
}

export default SignUpController;