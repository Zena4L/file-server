export const emailDownload = async (fileId) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/file/sendemail/${fileId}`,
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (res.data.status === 'success') {
            alert('Email sent successfully');
            setTimeout(() => {
                window.location.href = '/';
              }, 1500);
          }
    } catch (error) {
      alert('You Need to login first, Try again');
      setTimeout(() => {
        window.location.href = '/signup';
      }, 1500);
      console.log(err.res.data.message);
    }
  };