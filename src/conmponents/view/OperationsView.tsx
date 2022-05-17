import React,{useState} from 'react';
import classes from './OperationsView.module.css';

interface Props {
    className:string,
    formClassName:string,
    title:string,
    initialInputState:{},
    inputsArr:string[],
    labelArr:string[],
    onOperationSubmit?(...input:any):void,
    isLoanPending?:boolean
}

const OperationsView:React.FC<Props>=(props)=>{

    const [input,setInput]=useState<any>(props.initialInputState);
    const [error,setError]=useState('');

    const handleChange=(e:any)=>{
        setInput((prevState:any)=>{
            return {...prevState,
                    [e.target.name]:e.target.value}
        })
    }

    const onFormSubmit=(e:any)=>{
        e.preventDefault();
        
        if( input?.amount==='' || (input?.recipient && (input?.recipient==='' || !input?.recipient?.includes('@')) ) ){
            setError('Please enter a valid value');
            setInput(props.initialInputState);
            return;
        }
        
        let error=props.onOperationSubmit && props.onOperationSubmit(input);
        error ? setError(error): setError('');
        setInput(props.initialInputState);
    }

    let inputFields=props.inputsArr.map((inputValue:any)=>{
        return <input key={inputValue} type='text' value={input[inputValue]} name={inputValue} onChange={handleChange} className={classes['bank__operation-form__input']}/>
    })

    let labelFields=props.labelArr.map((labelValue:any)=>{
        return <label key={labelValue} className={classes['bank__operation-form__label']}>{labelValue}</label>
    })
    
    return (
        <div className={props.className}>
            <h2 className={classes["bank__operation__heading"]}>{props.title}</h2>
            <form onSubmit={onFormSubmit} action="" className={props.formClassName}>
                {inputFields}
                <button disabled={props.isLoanPending} className={classes['bank__operation-form__btn']}>&rarr;</button>
                {labelFields}
            </form>
            {<p className={classes['error']}>{error}</p>}
        </div>
    )
}

export default OperationsView;