/* eslint-disable no-undef */
// import { axios } from "axios";

async function login(email, password) {
  try {
    const res = await axios(
      {
        method: 'POST',
        url: 'http://localhost:3000/api/user/login',
        data: {
          email,
          password,
        },
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (res.data.status === 'success') {
      alert('Logged in successfully!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  } catch (error) {
    alert(err.response.data.message);
  }
}

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // console.log({ email, password });
  login(email, password);
});

const logoutButtons = document.querySelectorAll('.logout');
logoutButtons.forEach((logoutButton) => {
  logoutButton.addEventListener('click', () => {
    logoutButton.parentElement.submit();
  });
});
