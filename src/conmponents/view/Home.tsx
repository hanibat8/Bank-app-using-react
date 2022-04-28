import React, { useState } from 'react';
import classes from './Home.module.css';
import OperationsView from './OperationsView';

const Home=(props:any)=>{

    console.log('home view',props.bankObj.monthlyPayment)
    
    //const [transferValues,setTransferValues]=useState({recipient:'',amount:''});
    /*const [closeAccount,setCloseAccount]=useState({user:'',
                                                    pin:''});*/
    //const [loanValues,setLoanValues]=useState('');
    //const [loanPayment,setLoanPayment]=useState('');

    //const [loanRequestError,setLoanRequestError]=useState('');
    //const [loanPaymentError,setLoanPaymentError]=useState('');

   /* const onChangeTransferRecipient=(e:any)=>{
        setTransferValues((prevState)=>{
            return {...prevState,recipient:e.target.value}
        })
    }

    const onChangeTransferAmount=(e:any)=>{
        setTransferValues((prevState)=>{
            return {...prevState,amount:e.target.value}
        })
    }

    const onChangeCloseAccountUser=(e:any)=>{
        setCloseAccount((prevState)=>{
            return {...prevState,user:e.target.value}
        })
    }

    const onChangeCloseAccountPIN=(e:any)=>{
        setCloseAccount((prevState)=>{
            return {...prevState,pin:e.target.value}
        })
    }*/

    /*const onChangeLoanValues=(e:any)=>{
        setLoanValues(e.target.value);
    }*/

    /*const onChangeLoanPayment=(e:any)=>{
        setLoanPayment(e.target.value);
    }*/

    /*const onTransferSubmit=(e:any)=>{
        e.preventDefault();
        if(transferValues.amount==='' || transferValues.recipient==='' || isNaN(+transferValues.amount))
            return;
        props.onTransferAmount(transferValues.recipient,transferValues.amount);
        setTransferValues({amount:'',recipient:''});
    }

    const onLoanRequestSubmit=(e:any)=>{
        e.preventDefault();
        
        if(loanValues==='' || isNaN(+loanValues)){
            setLoanRequestError('Please enter a valid value');
            setLoanValues('');
            return;
        }

        let error=props.onRequestLoan(+loanValues);
        error ? setLoanRequestError(error) : setLoanRequestError('');
        setLoanValues('');
    }

    const onLoanPayment=(e:any)=>{
        e.preventDefault();
        
        if(loanPayment==='' || isNaN(+loanPayment) || (+loanPayment<+props.bankObj.monthlyPayment || +loanPayment>+props.bankObj.loan && +props.bankObj.loan)){
            setLoanPaymentError(`Please pay the right amount of ${props.bankObj.monthlyPayment} or more.`);
            setLoanPayment('');
            return;
        }

        let error=props.onLoanPayment(+loanPayment);
        error ? setLoanPaymentError(error): setLoanPaymentError('');
        setLoanPayment('');
    }*/

    let movementsContent=props.bankObj.movements?.map((move:string)=>{
        let totalClasses=+move>0?`${classes['bank__transaction--row--action']} ${classes['bank__transaction--row--action--deposit']}`:`${classes['bank__transaction--row--action']} ${classes['bank__transaction--row--action--withdrawal']}`;
        return  <div className={classes["bank__transaction--row"]}>
            <span className={totalClasses}>{+move>0?'DEPOSIT':'WITHDRAWAL'}</span>
            <span className={classes['bank__transaction--row--amount']}>{`$${move}`}</span>
        </div>
    });

    const transferClasses=`${classes['bank__operation']} ${classes['bank__operation--transfer']}`;
    const loanClasses=`${classes['bank__operation']} ${classes['bank__operation--loan']}`;
    const closeClasses=`${classes['bank__operation']} ${classes['bank__operation--close']}`;
    const loanFormClasses=`${classes['bank__operation-form']} ${classes['bank__operation-form--loan']}`;

    return(
        <>
        <main className={classes["main"]}>
            <button onClick={props.onLogout}>Logout</button>
        <div className={classes["balance"]}>
            <h2 className={classes["balance__label"]}>Current Balance</h2>
            <h1 className={classes["balance__value"]}>{`$${props.bankObj.balance}`}</h1>
        </div>
        <div className={classes["loan"]}>
            <h2 className={classes["loan__label"]}>Pending Loan</h2>
            <h1 className={classes["loan__value"]}>{`$${props.bankObj.loan?props.bankObj.loan:0}`}</h1>
        </div>
        {props.isLoanPending && <p className={classes['error']}>Loan installment due. Each installment of ${props.bankObj.monthlyPayment} or more</p>}
        <div className={classes["bank"]}>
            <div className={classes["bank__transactions"]}>
                {movementsContent}
                
            </div>
            <div className={classes["bank__operations"]}>
                {/*<div className={transferClasses}>
                    <h2 className={classes["bank__operation__heading"]}>
                        Transfer money</h2>
                        <form onSubmit={onTransferSubmit} action="" className={classes["bank__operation-form"]}>
                            <input type="text" value={transferValues.recipient} onChange={onChangeTransferRecipient} className={classes['bank__operation-form__input']}/>
                            <input type="text" value={transferValues.amount} onChange={onChangeTransferAmount} className={classes['bank__operation-form__input']}/>
                            <button disabled={props.isLoanPending} className={classes['bank__operation-form__btn']}>&rarr;</button>
                            <label className={classes["bank__operation-form__label"]}>Transfer to</label>
                            <label className={classes["bank__operation-form__label"]}>Amount</label>
                        </form>
                </div>*/}
                <OperationsView initialInputState={{recipient:'', amount:''}} className={transferClasses} formClassName={classes["bank__operation-form"]} inputsArr={['recipient','amount']} labelArr={['Transfer to','Amount']} onOperationSubmit={props.onTransferAmount} isLoanPending={props.isLoanPending} title='Transfer money'/>
                {/*<div className={loanClasses}>
                    <h2 className={classes["bank__operation__heading"]}>
                        Request loan</h2>
                        <form onSubmit={onLoanRequestSubmit} action="" className={loanFormClasses}>
                            <input value={loanValues} onChange={onChangeLoanValues} type="text" className={classes['bank__operation-form__input']}/>
                            <button disabled={props.isLoanPending} className={classes['bank__operation-form__btn']}>&rarr;</button>
                            <label className={classes["bank__operation-form__label"]}>Loan Amount</label>
                        </form>
                        {<p className={classes['error']}>{loanRequestError}</p>}
                </div>*/}
                <OperationsView initialInputState={{amount:''}} className={loanClasses} formClassName={loanFormClasses} inputsArr={['amount']} labelArr={['Loan Amount']} onOperationSubmit={props.onRequestLoan} isLoanPending={props.isLoanPending} title='Request loan'/>
                {/*<div className={transferClasses}>
                    <h2 className={classes["bank__operation__heading"]}>
                        Submit loan</h2>
                        <form onSubmit={onLoanPayment} action="" className={loanFormClasses}>
                            <input value={loanPayment} onChange={onChangeLoanPayment} type="text" className={classes['bank__operation-form__input']}/>
                            <button className={classes['bank__operation-form__btn']}>&rarr;</button>
                            <label className={classes["bank__operation-form__label"]}>Amount</label>
                        </form>
                        {<p className={classes['error']}>{loanPaymentError}</p>}
                </div>*/}
                <OperationsView initialInputState={{amount:''}} className={transferClasses} formClassName={loanFormClasses} inputsArr={['amount']} labelArr={['Amount']} onOperationSubmit={props.onLoanPayment} title='Submit loan'/>
                {/*<div className={closeClasses}>
                    <h2 className={classes["bank__operation__heading"]}>
                        Close account</h2>
                        <form action="" className={classes["bank__operation-form"]}>
                            <input type="text" value={closeAccount.user} onChange={onChangeCloseAccountUser} className={classes['bank__operation-form__input']}/>
                            <input type="text" value={closeAccount.pin} onChange={onChangeCloseAccountPIN} className={classes["bank__operation-form__input"]}/>
                            <button disabled={props.isLoanPending} className={classes["bank__operation-form__btn"]}>&rarr;</button>
                            <label className={classes["bank__operation-form__label"]}>Confirm user</label>
                            <label className={classes["bank__operation-form__label"]}>Confirm PIN</label>
                        </form>
            </div>*/}
                <OperationsView initialInputState={{recipient:'', amount:''}} className={closeClasses} formClassName={classes["bank__operation-form"]} inputsArr={['recipient','amount']} labelArr={['Confirm User','Confirm PIN']} isLoanPending={props.isLoanPending} title='Close account'/>
            </div>
        </div>
    </main>
    <footer className={classes['footer']}>

    </footer>
    </>
    )
       
}

export default Home;