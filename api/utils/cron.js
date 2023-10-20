import https from 'https';

const pingHandler = async (event, context) => {
  const url = 'https://pangilinan-capstone-3.onrender.com/';

  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log('Pinging Server...');
        resolve({
          statusCode: 200,
          body: 'Server pinged successfully',
        });
      } else {
        reject(new Error(`Server ping failed with status code: ${res.statusCode}`));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};

export default pingHandler;
