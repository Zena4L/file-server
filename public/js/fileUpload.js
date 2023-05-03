export const uploadfile = async (form)=>{
    try{
        const res = await axios(
            {
              method: 'POST',
              url:'http://localhost:3000/api/file/upload',
              data:form,
            },
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(res)
          if (res.data.status === 'success') {
            alert('file uploaded Successful!');
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          }
    }catch(err){
        alert(err.res.data.message)
    }
}