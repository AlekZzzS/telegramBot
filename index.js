import express from 'express'
import { TelegramBot } from './src/TelegramBotClass.js'
import  BodyParser  from 'body-parser'

const token = '6918168382:AAHmGOJXL3hPOVBQQnrR7qTV4u5jOtQIoCw'
const bot = new TelegramBot()

bot.start()
const app = express()

app.use(BodyParser.json())

app.post(`/${token}`, (req, res) => {
    bot.bot.processUpdate(req.body) 
    res.sendStatus(200)
})

const port = 3000
app.listen(port, () => {
    console.log(`Telegram bot listening at http://localhost:${port}`)
    const webhookUrl = 'https://da11-46-147-148-245.ngrok-free.app'
    bot.bot.setWebHook(`${webhookUrl}/${token}`).then(() => {
        console.log(`Webhook has been set to: ${webhookUrl}`)
    }).catch((error) => {
        console.error('Error setting webhook:', error)
    })
})