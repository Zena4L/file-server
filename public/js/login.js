/* eslint-disable no-undef */

export const login = async (email, password) => {
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
      // alert('Logged in successfully!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  } catch (error) {
    alert('Incorrect Email or Password, Try again');
    console.log(err.res.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/api/user/logout'
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};

