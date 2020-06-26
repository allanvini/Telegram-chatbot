const axios = require("axios");

module.exports = {
    getZip: async(ZIP) => {
        try {
            let response =
                await axios.get(`https://viacep.com.br/ws/${ZIP}/json/`).then(response => {
                    let zipCodeInformation = response.data;
                    if (!zipCodeInformation) {
                        throw new Error(`Não foram encontradas nenhuma informação para o CEP: ${ZIP}`);
                    }
                    return zipCodeInformation;
                })
            return response;
        } catch (error) {
            error.status = 500;
            return error;
        }
   }
}