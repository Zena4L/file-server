/* eslint-disable no-undef */
import {login,logout} from './login.js';
import signUp from './signup.js';
import {download} from './download.js';
import {updateSettings} from './updateSettings.js';
import {uploadfile} from './fileUpload.js';
import { emailDownload } from './emailDownload.js';


const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('#logout');
const downloadBtns = document.querySelectorAll('#downloadBtn');
const emailBtn = document.querySelectorAll('#EmailBtn');
const userDataForm = document.querySelector('.user-data-from');
const passwordForm = document.querySelector('.user-password-forms');
const uploadForm = document.querySelector('.file-upload');

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

    if(passwordForm){
      passwordForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        
       await updateSettings({passwordCurrent,password,passwordConfirm},'password');
       document.getElementById('password-current').value = '';
       document.getElementById('password').value = '';
       document.getElementById('password-confirm').value = '';
      // console.log({passwordCurrent,password,passwordConfirm})
      })
    }
 
if(uploadForm){
  uploadForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const form = new FormData();
    form.append('title',document.getElementById('title').value)
    form.append('description',document.getElementById('description').value)
    form.append('fileType',document.getElementById('fileType').value)
    form.append('originalname',document.getElementById('originalname').files[0])
    uploadfile(form);
    // console.log(form);
  })

}

if (emailBtn){
  emailBtn.forEach(emailBtn => {
    const fileId = emailBtn.dataset.id;
    emailBtn.addEventListener('click', () => {
      emailDownload(fileId);
    });
  });
}