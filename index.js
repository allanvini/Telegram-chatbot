require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const instruction = "Digite alguns dos comandos abaixo:\n\n/Nome: retorna o seu nome\n\n/Noticias: as principais noticias do dia\n\n/cep <00000-000>: retorna o endereço de qualquer CEP informado\n\n/tempo <cidade>: informa o tempo atual de qualquer cidade informada";
const cep = require('./utils/cep/cepRequest');
const news = require('./utils/news/newsRequest');
const tempo = require('./utils/weather/weatherRequest');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async(msg) => {

    const chatId = msg.chat.id;

    let command = msg.text.toLocaleLowerCase();

    command = command.split(' ');

    // send a message to the chat acknowledging receipt of their message
    switch (command[0]) {

        case "/start":
            bot.sendMessage(chatId, instruction);
            break;

        case "/nome":
            bot.sendMessage(chatId, "Seu nome é: " + msg.from.first_name + " " + msg.from.last_name);
            break;

        case "/noticias":
            const newsLetter = await news.getNews();
            newsLetter.forEach(element => {
                bot.sendMessage(msg.chat.id, `${element.title}\n\n${element.link}`);
            });
            break;

        case "/cep":
            const { logradouro, localidade, uf } = await cep.getZip(command[1]);
            if (!logradouro || !localidade || !uf) {
                bot.sendMessage(msg.chat.id, "Falha ao buscar informações do CEP informado, verifique se o dado está correto");
                break;
            }
            bot.sendMessage(msg.chat.id, `Os dados retornados para o cep ${command[1]} são:\n\nRua: ${logradouro}\n\nCidade: ${localidade}\n\nEstado: ${uf}`);
            break;

        case "/tempo":
            command[1] = tempo.normalizeParameter(command[1]);
            const { weather, main, name } = await tempo.getWeather(command[1])
            if (!weather || !main || !name) {
                bot.sendMessage(msg.chat.id, "Falha ao buscar os dados da cidade informada, verifique se o nome está correto");
                break;
            }
            bot.sendMessage(msg.chat.id, `As informações de tempo para a cidade de ${name} são:\n\nTempo: ${weather[0].description}\n\nTemperatura atual: ${main.temp}°C\n\nSensação térmica: ${main.feels_like}°C\n\nTemperatura minima: ${main.temp_min}°C\n\nTemperatura máxima: ${main.temp_max}°C\n\nUmidade relativa: ${main.humidity}%`)
            break;

        default:
            bot.sendMessage(chatId, 'Comando inválido');
            bot.sendMessage(chatId, instruction);
            break;
    }

});