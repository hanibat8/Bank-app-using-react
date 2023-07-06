import React from 'react';
import classes from './Home.module.css';
import OperationsView from './OperationsView';

const Home=(props:any)=>{

    //console.log('home view',props.bankObj)

    let movementsContent=props.bankObj.movements?.map((move:string,index:number)=>{
        let totalClasses=+move>0?`${classes['bank__transaction--row--action']} ${classes['bank__transaction--row--action--deposit']}`:`${classes['bank__transaction--row--action']} ${classes['bank__transaction--row--action--withdrawal']}`;
        return  <div key={index} className={classes["bank__transaction--row"]}>
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
                {props.isLoanPending && <p className={classes['error']}>Loan installment due. Each installment of ${props.bankObj.monthlyPayment} or more.<br/> Please submit pending installment to access other features.</p>}
                <div className={classes["bank"]}>
                    <div className={classes["bank__transactions"]}>
                        {movementsContent}                        
                    </div>
                    <div className={classes["bank__operations"]}>
                        <OperationsView initialInputState={{recipient:'', amount:''}} className={transferClasses} formClassName={classes["bank__operation-form"]} inputsArr={['recipient','amount']} labelArr={['Transfer to (email)','Amount']} onOperationSubmit={props.onTransferAmount} isLoanPending={props.isLoanPending} title='Transfer money'/>
                        <OperationsView initialInputState={{amount:''}} className={loanClasses} formClassName={loanFormClasses} inputsArr={['amount']} labelArr={['Loan Amount']} onOperationSubmit={props.onRequestLoan} isLoanPending={props.isLoanPending} title='Request loan'/>
                        <OperationsView initialInputState={{amount:''}} className={transferClasses} formClassName={loanFormClasses} inputsArr={['amount']} labelArr={['Amount']} onOperationSubmit={props.onLoanPayment} title='Submit loan'/>
                        <OperationsView initialInputState={{recipient:'', amount:''}} className={closeClasses} formClassName={classes["bank__operation-form"]} inputsArr={['recipient','amount']} labelArr={['Confirm User Email','PIN']} onOperationSubmit={props.onCloseAccount} isLoanPending={props.isLoanPending} title='Close account'/>
                    </div>
                </div>
            </main>
            <footer className={classes['footer']}>

            </footer>
        </>
    )
       
}

export default Home;