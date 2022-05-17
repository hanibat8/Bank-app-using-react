import React,{ useState, useEffect } from 'react';
import Home from '../view/Home';
import LoadingSpinner from '../view/LoadingSpinner';
import { useDatabaseUpdateMutation,useDatabaseSnapshot  } from "@react-query-firebase/database";
import { useAuthUser,useAuthSignOut,useAuthDeleteUser,useAuthReauthenticateWithCredential } from "@react-query-firebase/auth";
import { ref } from "firebase/database";
import { db } from '../../firebase-config';
import { auth } from '../../firebase-config';
import {EmailAuthProvider} from 'firebase/auth';

const HomeController=()=>{
    //current user
    const user:any = useAuthUser(["user"], auth);

    //Logout functionality
    const mutationLogout = useAuthSignOut(auth);

    //Reauthenticate with credentials
    const reauthenticateMutation = useAuthReauthenticateWithCredential();

    //to access and mutate current user data
    const currentUserDbRef = ref(db, `users/${user.data?.uid}`);
    const currentUserMutation:any = useDatabaseUpdateMutation(currentUserDbRef);
    const currentUserSnapshot = useDatabaseSnapshot(["user",user.data?.uid], currentUserDbRef, {
        subscribe: true,
    });

    console.log(currentUserSnapshot.data?.val()?.movements);
    console.log(+currentUserSnapshot.data?.val().loan)

    //to access all users data for transfer functionality
    const usersDbRef = ref(db, `users/`);
    const usersSnapshot = useDatabaseSnapshot(["users",user.data?.uid], usersDbRef, {
        subscribe: true,
    });
    
    //flag set when loan is pending and passed down to Home view to display it
    const [isLoanPending,setIsLoanPending]=useState(false);

    //setting transferRecipient as state so below code can work
    const [transferRecipient,setTransferRecipient]=useState<{recipient:string,amount:number}>({recipient:'',amount:0});

    //to access and mutate transfer recipient data
    const recipientDbRef = ref(db, `users/${transferRecipient.recipient}`);
    const recipientSnapshot = useDatabaseSnapshot(["user",transferRecipient.recipient], recipientDbRef, {
            subscribe: true,
        });
    const recipientUserMutation:any = useDatabaseUpdateMutation(recipientDbRef);

    //To make sure no loan is pending when app first loads
    useEffect(() => {
        
        let isTimeUp=(Math.floor((Math.abs(new Date().valueOf() - new Date(currentUserSnapshot.data?.val().currentDate).valueOf()))/1000/60))>5;
        
        if(+currentUserSnapshot.data?.val().loan>0 && isTimeUp)
            setIsLoanPending(true);
            
    },[currentUserSnapshot.isSuccess]);

    //functionality to set loan pending after 5 mins of loan request or after every loan installment paid
    useEffect(() => {
        console.log(+currentUserMutation.variables?.loan,+currentUserSnapshot.data?.val().loan);
        let loan=(+currentUserMutation.variables?.loan) ? (+currentUserMutation.variables?.loan) : (+currentUserSnapshot.data?.val().loan);
        console.log(loan);
        let timer=setTimeout(() =>{
            if(loan>0){
                return setIsLoanPending(true)
            }},5*60*1000)
    
        return () => {
            clearTimeout(timer);
        };

    },[currentUserMutation.isSuccess,currentUserSnapshot.isSuccess]);

    const mutateMovementsArr=(dataSnapshotMovementArr:string[],movementMutationArr:string[],amount:number,sign:string)=>{
        
        let arr=movementMutationArr ? movementMutationArr : dataSnapshotMovementArr
        arr.push(`${sign}${amount}`);
        return arr;
    }

    //functionality to transfer money to recipient. will run if transferRecipient is set or is recipientSnapshot.isSuccess is changed. using useEffect because i need this code to run after transferRecipient is set. writes mutations to db
    useEffect(() => {
        if(!transferRecipient.recipient || transferRecipient.amount==0 || !recipientSnapshot.isSuccess)
            return;

        let transferRecipientMovementArr=mutateMovementsArr(recipientSnapshot.data?.val()?.movements,recipientUserMutation?.variables?.movements,transferRecipient.amount,'+');

        recipientUserMutation.mutate({...recipientSnapshot.data?.val(),
            movements:transferRecipientMovementArr,
            balance:+(+recipientSnapshot.data?.val()?.balance+(+transferRecipient.amount)).toFixed(2),
        })

        setTransferRecipient({amount:0,recipient:''});

    },[transferRecipient.recipient, recipientSnapshot.isSuccess]);

    useEffect(()=>{
        
        user.data?.delete().then((res:any) => {
            // User deleted.
            let data=res.data;
            console.log(data)
            //mutationLogout.mutate();
          }).catch((error:any) => {
            return error.message;
        });

    },[reauthenticateMutation.isSuccess])

    const checkTransferRecipientExists=(recipient:string,user:{name:string},userID:string)=>{
        return {'exists':user.name.includes(recipient),'user':userID}};
        
    //functionality to transfer money from user to a recipient
    const onTransferAmount=(params:{recipient:string,amount:string})=>{
        
        let transferRecipientExistObj;
        for (const user in usersSnapshot.data?.val()) {
            transferRecipientExistObj=checkTransferRecipientExists(params.recipient.split('@')[0],usersSnapshot.data?.val()[user],user);
            if(transferRecipientExistObj.exists)
                break;
        }

        if(!transferRecipientExistObj?.exists || user.data?.email==params.recipient)
            return 'User doesn\'t exists';

        setTransferRecipient({'recipient':transferRecipientExistObj.user, 'amount':+params.amount});

        let currentUserMovementArr=mutateMovementsArr(currentUserSnapshot.data?.val()?.movements,currentUserMutation?.variables?.movements,+params.amount,'-');
        
        currentUserMutation.mutate(
            {...currentUserSnapshot.data?.val(),
                    movements:currentUserMovementArr,
                    balance:+(+currentUserSnapshot.data?.val()?.balance-(+params.amount)).toFixed(2),
            })
    }

    const writeDataToDB=(mutation:any,snapshot:any,movementArr:string[],loan:number,installment:number,date:Date,balance:number,monthlyPayment:number)=>{
        mutation.mutate(
            {...snapshot.data?.val(),
                    movements:movementArr,
                    loan:loan,
                    installments:installment,
                    currentDate:date,
                    balance:balance,
                    monthlyPayment:monthlyPayment
            })
    }

    const onRequestLoan=(params:{amount:number})=>{
        console.log(+currentUserSnapshot.data?.val()?.loan,+currentUserSnapshot.data?.val()?.loan>0);
        if(isNaN(+params.amount))
            return 'Please submit appropriate amount';

        if(+currentUserSnapshot.data?.val()?.loan>0)
            return 'Loan already given';

        let interestAmount=params.amount*(2/100);
        let monthlyPayment=(interestAmount+(+params.amount))/12;
        let currentDate=new Date();
        let movementsArr=mutateMovementsArr( currentUserSnapshot.data?.val()?.movements,currentUserMutation?.variables?.movements ,params.amount,'+');

        writeDataToDB(currentUserMutation,currentUserSnapshot,movementsArr,
                    +(+params.amount+interestAmount).toFixed(2),0,currentDate,
                    +(+currentUserSnapshot.data?.val()?.balance+(+params.amount)).toFixed(2),
                    +monthlyPayment.toFixed(2)
        );
    
    }

    const onLoanPayment=(params:{amount:number})=>{
        if(+(currentUserSnapshot.data?.val().loan)<=0)
            return 'No loan pending';

        if((isNaN(+params.amount) || +params.amount<+currentUserSnapshot.data?.val().monthlyPayment || +params.amount>+currentUserSnapshot.data?.val().loan))
            return 'Please submit appropriate amount';
        
        let currentDate=new Date();
        let loanAmount=(+currentUserSnapshot.data?.val().loan) - (+params.amount)>0 ? (+currentUserSnapshot.data?.val().loan) - (+params.amount) : 0;
        let movementsArr=mutateMovementsArr(currentUserSnapshot.data?.val()?.movements,currentUserMutation?.variables?.movements,params.amount,'-');
        console.log(loanAmount,+currentUserSnapshot.data?.val().loan,(+currentUserSnapshot.data?.val().loan) - (+params.amount),(+currentUserSnapshot.data?.val().loan) - (+params.amount)>0)
        writeDataToDB(currentUserMutation,currentUserSnapshot,movementsArr,
            +loanAmount.toFixed(2),+currentUserSnapshot.data?.val().installments+1,currentDate,
            +((+currentUserSnapshot.data?.val()?.balance) - params.amount).toFixed(2),
            +(+((+currentUserSnapshot.data?.val().loan) - params.amount)/(12 - (+currentUserSnapshot.data?.val().installments+1))).toFixed(0)
        );
            
        setIsLoanPending(false)    
    }

    const reauthenticateUser=(email:string,password:string)=>{
        if(!auth.currentUser)
            return;
        
        try{
            reauthenticateMutation.mutate({
            user: auth.currentUser,
            // Any Auth credential supported...
            credential: EmailAuthProvider.credential(user.data?.email,password)})
        }
        catch(error){
            console.log(error)
            return error;
        }
    }

    const onCloseAccount=(params:{recipient:string,amount:string})=>{
        
        let {recipient:email,amount:password}=params;
        console.log(user?.data?.email,email);
        let userExists=user?.data?.email==email;
        console.log(userExists);
        
        if(!userExists)
            return 'Invalid email address';

        let isLoan=(currentUserMutation?.variables?.loan) ? (currentUserMutation?.variables?.loan) : currentUserSnapshot.data?.val()?.loan 

        if(isLoan>0)
            return 'Please pay remaining loan';

        user.data?.delete().then((res:any) => {
            // User deleted.
            let data=res.data;
            console.log(data)

          }).catch((error:any) => {
            console.log(error.message)
            let errMsg:any;
            
            if(error.message.includes('auth/requires-recent-login'))
                errMsg=reauthenticateUser(email,password);
            
            return (errMsg?.message) ? (errMsg?.message): (error?.message);
          });
    }

    const onLogout=()=>{
        mutationLogout.mutate();
    }


    if(currentUserSnapshot.isLoading || currentUserMutation.isLoading || !user.isSuccess)
        return <LoadingSpinner/>


    if(((currentUserSnapshot.isSuccess && !(!!currentUserMutation.variables)) || currentUserMutation.isSuccess) && user.isSuccess){
       console.log(currentUserSnapshot.data?.val().movements,!(!!currentUserMutation.variables),currentUserMutation.variables,currentUserMutation.isSuccess, user.isSuccess)
        return(
            <Home onTransferAmount={onTransferAmount} 
                  onRequestLoan={onRequestLoan} 
                  onLoanPayment={onLoanPayment} 
                  onCloseAccount={onCloseAccount}
                  onLogout={onLogout} 
                  isLoanPending={isLoanPending} 
                  bankObj={currentUserMutation.variables ? currentUserMutation.variables: currentUserSnapshot.data?.val()}/>
        )
    }

    return <></>

}

export default HomeController;