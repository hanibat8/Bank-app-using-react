import React,{useState, useEffect} from 'react';
import Home from '../view/Home';
import { useDatabaseUpdateMutation,useDatabaseSnapshot  } from "@react-query-firebase/database";
import { useAuthUser,useAuthSignOut } from "@react-query-firebase/auth";
import { ref } from "firebase/database";
import { db } from '../../firebase-config';
import { auth } from '../../firebase-config';

const HomeController=()=>{

    const user = useAuthUser(["user"], auth);
    const mutationLogout = useAuthSignOut(auth);

    const dbRef = ref(db, `users/${user.data?.uid}`);
    const mutation = useDatabaseUpdateMutation(dbRef);

    const currentUserSnapshot = useDatabaseSnapshot(["user",user.data?.uid], dbRef, {
        subscribe: true,
    });
    
    const [isLoanPending,setIsLoanPending]=useState(false);

    useEffect(() => {

        console.log('currentUserSnapshot loan',currentUserSnapshot.data?.val()?.loan)
        let isTimeUp=(Math.floor((Math.abs(new Date().valueOf() - new Date(currentUserSnapshot.data?.val().currentDate).valueOf()))/1000/60))>5;
        console.log('time diff',((new Date().valueOf())-(new Date(currentUserSnapshot.data?.val()?.currentDate).valueOf()))/1000/60);
        console.log(isTimeUp);
        
        if(currentUserSnapshot.data?.val().loan && isTimeUp){
            setIsLoanPending(true);
        }
            
    },[currentUserSnapshot.isSuccess]);

    useEffect(() => {
        console.log('entered');
        console.log('mutation variables loan',mutation.variables?.loan);
        
        let timer=setTimeout(() =>{
            if(mutation.variables?.loan){
                console.log('here');
                return setIsLoanPending(true)
            }},5*60*1000)
    
        return () => {
            clearTimeout(timer);
        };
    },[mutation.isSuccess,currentUserSnapshot.isSuccess]);
   
    const onTransferAmount=(recipient:string,amount:number)=>{
        
    }

    const onRequestLoan=(params:{amount:number})=>{
        if(currentUserSnapshot.data?.val()?.loan>0)
            return 'Loan already given';

        const interestAmount=params.amount*(2/100);
        const monthlyPayment=(interestAmount+params.amount)/12;
        let currentDate=new Date();
        
        let movementsArr;
        if(currentUserSnapshot.data?.val()?.movements?.length>0)
            movementsArr=currentUserSnapshot.data?.val()?.movements 
        else
            movementsArr=[];
        
        mutation.mutate(
            {...currentUserSnapshot.data?.val(),
                    movements:[...movementsArr ,`+${params.amount}`],
                    loan:(+params.amount+interestAmount).toFixed(2),
                    installments:0,
                    currentDate,
                    balance:+(+currentUserSnapshot.data?.val()?.balance+(+params.amount)).toFixed(2),
                    monthlyPayment:(+monthlyPayment).toFixed(2)
            })
    }

    const onLoanPayment=(params:{amount:number})=>{
        console.log('here');
        if(+(currentUserSnapshot.data?.val().loan)<=0){
            console.log(+(currentUserSnapshot.data?.val().loan));
            return 'No loan pending';
        }

        if((+params.amount<+currentUserSnapshot.data?.val().monthlyPayment || +params.amount>+currentUserSnapshot.data?.val().loan)){
            return 'Please submit appropriate amount';
        }
        
        let currentDate=new Date();
        let loanAmount=(+currentUserSnapshot.data?.val().loan)-params.amount>0 ? (+currentUserSnapshot.data?.val().loan)-params.amount : 0;
        let movementsArr=currentUserSnapshot.data?.val()?.movements ? currentUserSnapshot.data?.val()?.movements : [];

        mutation.mutate(
            {...currentUserSnapshot.data?.val(),
                    movements:[...movementsArr,`-${params.amount}`],
                    loan:loanAmount.toFixed(2),
                    installments:+currentUserSnapshot.data?.val().installments+1,
                    currentDate,
                    balance:((+currentUserSnapshot.data?.val()?.balance)-params.amount).toFixed(2),
                    monthlyPayment:(+((+currentUserSnapshot.data?.val().loan)-params.amount)/(12-(+currentUserSnapshot.data?.val().installments+1))).toFixed(0)
            })
            
        setIsLoanPending(false)    
    }

    const onLogout=()=>{
        mutationLogout.mutate();
    }

    if(currentUserSnapshot.isLoading || mutation.isLoading )
        return <p>'loading....'</p>;

    return(
        <Home onTransferAmount={onTransferAmount} 
              onRequestLoan={onRequestLoan} 
              onLoanPayment={onLoanPayment} 
              onLogout={onLogout} 
              isLoanPending={isLoanPending} 
              bankObj={mutation.variables ? mutation.variables: currentUserSnapshot.data?.val()}/>
    )
}

export default HomeController;