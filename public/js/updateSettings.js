//type is either password or data
export const updateSettings = async (data,type)=>{
    try{
        const url = type === 'password' ? 'http://localhost:3000/api/user/updatepassword' : 'http://localhost:3000/api/user/updateme'
        const res = await axios(
            {
              method: 'PATCH',
              url,
              data,
            },
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (res.data.status === 'success') {
            alert('update Successful!');
            // setTimeout(() => {
            //   window.location.href = '/profile';
            // }, 1500);
          }
    }catch(err){
        alert(err.res.data.message)
    }
}