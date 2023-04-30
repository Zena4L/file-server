// import { sign } from "jsonwebtoken";

const signUp = async (name ,email, password,passwordConfirm) => {
    try {
      const res = await axios(
        {
          method: 'POST',
          url: 'http://localhost:3000/api/user/signup',
          data: {
            name,
            email,
            password,
            passwordConfirm,
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
        alert('sign-up successfully!');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (error) {
      alert('Signup fail, Try again');
      console.log(err.res.data.message);
    }
  };

export default signUp;