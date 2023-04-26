/* eslint-disable no-undef */
// import { axios } from "axios";

async function login(email, password) {
  try {
    await axios.post(
      'http://localhost:3000/api/user/login',
      {
        email,
        password,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // console.log(response.data);
    // do something with response
  } catch (error) {
    // console.error(error);
    // handle error
  }
}



document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // console.log({ email, password });
  login(email, password);
});
