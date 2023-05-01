/* eslint-disable no-undef */
import {login,logout} from './login.js';
import signUp from './signup.js';
import {download} from './download.js';
import {updateSettings} from './updateSettings.js';


const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('#logout');
const downloadBtns = document.querySelectorAll('#downloadBtn');
const userDataForm = document.querySelector('.user-data-from');
const passwordForm = document.querySelector('.user-password-forms');

const signup = document.querySelector('#sign-in');


if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signup)
    signup.addEventListener('submit',(e)=>{
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email-sign').value;
        const password = document.getElementById('password-sign').value;
        const passwordConfirm = document.getElementById('confirm-password').value;

        console.log({name,email,password,passwordConfirm})
        signUp(name,email,password,passwordConfirm);
        
    })

  downloadBtns.forEach(downloadBtn => {
      const fileId = downloadBtn.dataset.id;
      downloadBtn.addEventListener('click', () => {
        download(fileId);
      });
    });

  if(userDataForm)
    userDataForm.addEventListener('submit',(e)=>{
      e.preventDefault;
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      updateSettings({name,email},'data');
    })

    if(passwordForm)
      password.FormaddEventListener('submit',async (e)=>{
        e.preventDefault;
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
       await updateSettings({passwordCurrent,password,passwordConfirm},'password');
       document.getElementById('password-current').value = '';
       document.getElementById('password').value = '';
       document.getElementById('password-confirm').value = '';
        
      })