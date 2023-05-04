
export const download = async (fileId) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/file/download/${fileId}`,
      withCredentials: true,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Get the original filename from the Content-Disposition header
    const contentDisposition = res.headers['content-disposition'];
    const match = contentDisposition.match(/filename="?(.+?)"?$/);
    const originalFilename = match ? match[1] : 'unknown';

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(new Blob([res.data]));

    // Create a temporary <a> element with the URL and click it to download the file
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', originalFilename); // Set the original filename as the download filename
    document.body.appendChild(link);
    link.click();

    // Remove the temporary <a> element
    document.body.removeChild(link);
  } catch (error) {
    alert('Cannot download this file');
    console.log(error.response.data.message);
  }
};


  