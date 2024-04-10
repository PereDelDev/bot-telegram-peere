const express = require('express')
const { Telegraf } = require('telegraf')
const axios = require('axios').default

//Config .env
require('dotenv').config()

// Creamos app de Express
const app = express();
//Creamos el bot de Telegram
const bot = new Telegraf(process.env.BOT_TOKEN)

// Config conexión telegram
app.use(bot.webhookCallback('/telegram-bot'))
bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`)

app.post('/telegram-bot', (req, res) => {
    res.send('Responde')

});

// COMANDOS BOT
bot.command('test', ctx => {
    ctx.reply('FUNSIONA!!')
})
bot.command('reunion', ctx => {
    ctx.replyWithHTML('https://us06web.zoom.us/j/82410011043?pwd=QDDXN4RFgthnpKiY8uyrCbFrcNglaU.1#success')
})
bot.command('dado', ctx => {
    ctx.replyWithDice()
})

bot.command('tiempo', async ctx => {
    console.log(ctx.message)
    let ciudad = ctx.message.text.slice(8)
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=12cc61f3282afaca14152a6185f43de0&units=metric`)
        ctx.reply(`El tempatura es ${response.data.main.temp}`)
        ctx.reply(`La temperatura maxima es ${response.data.main.temp_max}`)
        ctx.reply(`La temperatura minima es ${response.data.main.temp_min}`)
        ctx.reply(`la humedad es ${response.data.main.humidity}`)
    } catch (error) {
        ctx.reply(`No disponemos de datos para la ciudad ${ciudad}`)
    }
})

// Poner la app a escuchar en un puerto
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`)
})