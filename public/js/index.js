/* eslint-disable no-undef */
import {login,logout} from './login.js';


const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('#logout');

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);