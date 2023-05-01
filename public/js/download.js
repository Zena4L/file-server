export const download = async (slug) => {
    try {
      const res = await axios(
        {
          method: 'GET',
          url: `http://localhost:3000/api/file/download/${slug}`,
          responseType: 'blob', // to handle binary data
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (res.data.status === 'success') {
        const downloadUrl = window.URL.createObjectURL(new Blob([res.data.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', slug);
        document.body.appendChild(link);
        link.click();
        alert('Downloading...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (error) {
      alert('Cannot download this file');
      console.log(err.response.data.message);
    }
  };
  
//   export default download;
  