export const download = async (id) => {
    try {
      const res = await axios(
        {
          method: 'GET',
          url: `http://localhost:3000/api/file/download/${id}`,
        },
        {
          withCredentials: true,
          responseType: 'blob',
        }
      );
  
      if (res.status === 200) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.pdf');
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      alert('Cannot download this file');
      console.log(error.response.data.message);
    }
  };
  