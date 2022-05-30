import  React  from 'react';
import { useField } from "formik";
import classes from './InputView.module.css';

interface Props{
  name:string,
  id?:string,
  placeholder?:string,
  label:string,
  type:string
}

const Input:React.FC<Props>=(props)=>{
    const [field, meta] = useField(props);

    const inputClasses=meta.touched && meta.error ? `${classes.input} ${classes.error}`:`${classes.input}`;
    return (
      <React.Fragment>
        <label className={classes.label} htmlFor={props.id || props.name}>{props.label}</label>
        <input className={inputClasses} {...field} {...props}  id={props.name} placeholder={props?.placeholder}/>
      </React.Fragment>
    );
}

export default Input;