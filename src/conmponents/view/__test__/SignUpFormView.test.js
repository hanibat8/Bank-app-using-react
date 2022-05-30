import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpFormView from '../SignUpFormView.tsx';
import { BrowserRouter } from 'react-router-dom';

const MockedSignUpFormView=({onSubmit,addUserToDB})=>{
    return(
        <BrowserRouter>
            <SignUpFormView onSubmitHandler={onSubmit} addUserToDB={addUserToDB}/>
        </BrowserRouter>
    )
}

/* beforeEach(()=>{
        render(<MockedSignUpFormView />);
        emailInput = screen.getByRole('textbox', {  name: /email address/i});
        passInput = screen.getByPlaceholderText(/password/i);
        confirmPassInput = screen.getByLabelText(/confirm password/i);
        signUpBtn = screen.getByRole('button', {  name: /sign up/i})
})*/

/*describe('checking if btn is enabled/disabled depending on inputs',()=>{
    
    it('btn is disabled if sign up with invalid inputs ',async () => {
        render(<MockedSignUpFormView />);
        const emailInput = screen.getByRole('textbox', {  name: /email address/i});
        const passInput = screen.getByPlaceholderText(/password/i);
        const confirmPassInput = screen.getByLabelText(/confirm password/i);
        const signUpBtn = screen.getByRole('button', {  name: /sign up/i})
      
        userEvent.type(emailInput,'saA')
    
        userEvent.type(passInput,'sadasdas')
     
        userEvent.type(confirmPassInput,'czxcxzcxz')
        
        await waitFor(async ()=>{ 
            expect(signUpBtn).not.toBeDisabled()})
        
        screen.debug()
    });

    it('btn is enabled if sign up with valid inputs ',async () => {
        render(<MockedSignUpFormView />);
        const emailInput = screen.getByRole('textbox', {  name: /email address/i});
        const passInput = screen.getByPlaceholderText(/password/i);
        const confirmPassInput = screen.getByLabelText(/confirm password/i);
        const signUpBtn = screen.getByRole('button', {  name: /sign up/i})
      
        userEvent.type(emailInput,'mnbmbm@gmail.com')
    
        userEvent.type(passInput,'czxcxzcxz')
     
        userEvent.type(confirmPassInput,'czxcxzcxz')
        
        await waitFor(async ()=>{ 
            expect(signUpBtn).toBeEnabled()})
        
        screen.debug()
    });
    

})*/

describe('form behavior on resolve/rejection of onSubmit',()=>{
    
    it('display error on wrong input (rejection)',async () => {

        const onSubmit=jest.fn((em,pass)=>Promise.reject('fail'))
        
        render(<MockedSignUpFormView onSubmit={onSubmit} addUserToDB={()=>{console.log('ok')}}/>);
        
        const emailInput = screen.getByRole('textbox', {  name: /email address/i});
        const passInput = screen.getByPlaceholderText(/password/i);
        const confirmPassInput = screen.getByLabelText(/confirm password/i);
        const signUpBtn = screen.getByRole('button', {  name: /sign up/i})
      
        userEvent.type(emailInput,'')
    
        userEvent.type(passInput,'sadasdas')
     
        userEvent.type(confirmPassInput,'czxcxzcxz')

        userEvent.click(signUpBtn)

        /*await waitFor(async ()=>{
            expect(onSubmit).toBeCalled(1)})*/    

        await waitFor(async ()=>{
            expect(screen.getByText(/fail/i)).toBeInTheDocument()})    
        
        screen.debug()
    });

    /*it('display success message on right input (resolve)',async () => {
        
        render(<MockedSignUpFormView onSubmit={(em,pass)=>Promise.resolve({em,pass})} addUserToDB={()=>{console.log('ok')}}/>)
        
        const emailInput = screen.getByRole('textbox', {  name: /email address/i});
        const passInput = screen.getByPlaceholderText(/password/i);
        const confirmPassInput = screen.getByLabelText(/confirm password/i);
        const signUpBtn = screen.getByRole('button', {  name: /sign up/i})
      
        userEvent.type(emailInput,'mnbmbm@gmail.com')
    
        userEvent.type(passInput,'czxcxzcxz')
     
        userEvent.type(confirmPassInput,'czxcxzcxz')
        
        await waitFor(async ()=>{ 
            expect(signUpBtn).toBeCalled(1)})

        await waitFor(async ()=>{ 
            expect(signUpBtn).toBeEnabled()})
        
        screen.debug()
    });*/
    

})