const axios = require('axios');

module.exports = {

    getNews: async() => {

        try {
            return await axios.get('http://127.0.0.1:5000/news').then(response => {
                return response.data;
            });
        } catch (error) {
            error.status = 500;
            return error;
        }

    }

}

// You can see this API at https://github.com/allanvini/Python-web-scraping