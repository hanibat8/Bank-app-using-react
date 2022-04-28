import  React  from 'react';
import { useField } from "formik";
import classes from './InputView.module.css';

interface Props{
  name:string,
  id?:string,
  label:string,
  type:string
}

const Input:React.FC<Props>=(props)=>{
    //console.log(props);
    const [field, meta] = useField(props);

    const inputClasses=meta.touched && meta.error ? `${classes.input} ${classes.error}`:`${classes.input}`;
    return (
      <React.Fragment>
        <label className={classes.label} htmlFor={props.id || props.name}>{props.label}</label>
        <input className={inputClasses} {...field} {...props} />
      </React.Fragment>
    );
}

export default Input;