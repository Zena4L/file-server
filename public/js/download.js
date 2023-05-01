export const download = async (fileId) => {
    try {
      const res = await axios({
        method: 'GET',
        url: `http://localhost:3000/api/file/download/${fileId}`,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (res.data.status === 'success') {
        alert('Downloading...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (error) {
      alert('Cannot download this file');
      console.log(error.response.data.message);
    }
  };
  