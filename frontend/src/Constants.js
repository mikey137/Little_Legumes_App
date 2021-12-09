const prod = {
    url: {
     API_URL: 'https://little-legumes.herokuapp.com'
     }
   };
   const dev = {
    url: {
     API_URL: 'http://localhost:3001'
    }
   };
   export const apiConfig = process.env.NODE_ENV === 'development' ? dev : prod;