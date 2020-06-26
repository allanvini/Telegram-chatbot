require('dotenv').config();
const axios = require('axios');
const weatherToken = process.env.WEATHER_TOKEN;

module.exports = {
    getWeather: async(city) => {
        try {
            return await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&lang=pt_br&units=metric&appid=${weatherToken}`).then(response => {
                return response.data;
            })
        } catch (error) {
            error.status = 500;
            return error;
        }
    },
    normalizeParameter: (command) => {
        return command.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');
    }
}