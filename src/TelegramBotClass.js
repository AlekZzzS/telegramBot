import TelegramApi from 'node-telegram-bot-api'
import { getCat } from './catModule.js'
import { choiceTariff } from './tariffModule.js'
import { startState } from './startModule.js'
import { rabbitMq } from './rabbitMqModule.js'
import { done } from './doneModule.js'

export class TelegramBot {
    constructor() {
        this.token = '6918168382:AAHmGOJXL3hPOVBQQnrR7qTV4u5jOtQIoCw'
        this.bot = new TelegramApi(this.token)
        this.chatStates = {}
        this.done = false
    }

    async start() {
        this.bot.setMyCommands([
            { command: '/start', description: 'Начальное приветствие' }
        ])

        const channel = await rabbitMq()
        
        this.bot.on('message', (msg) => {
            channel.sendToQueue('telegram_messages', Buffer.from(JSON.stringify(msg)));
        })
        this.bot.on('callback_query', (query) => {
            channel.sendToQueue('telegram_messages', Buffer.from(JSON.stringify(query)));
        })

        channel.consume('telegram_messages', async (msg) => {
            let message = JSON.parse((msg.content).toString('utf-8'))

            if (message.chat || message.message.chat) {
                const chatId = message.chat ? message.chat.id : message.message.chat.id
                const text = message.text ? message.text : message.data
                let state = this.chatStates[chatId] || 'start'
                if (text === '/start') {
                    state = 'start'
                }

                if (message.photo) {
                    await getCat(this.bot, chatId)
                    channel.ack(msg)
                    return 
                }

                if (text === 'котики') {
                    await getCat(this.bot, chatId, text)
                    channel.ack(msg)
                    return
                }

                if (text === 'тариф') {
                    await choiceTariff(this.bot, chatId)
                    channel.ack(msg)
                    return
                }

                switch (state) {
                    case 'start':
                        await startState(this.bot, chatId)
                        this.chatStates[chatId] = 'chooseTariff'
                        break
                    case 'chooseTariff':
                        if (text === 'Да') {
                            choiceTariff(this.bot, chatId)
                        } else if (text === 'Нет') {
                            await this.bot.sendMessage(chatId, 'Хорошо, если вам что-то понадобится, обращайтесь!😁', {
                                reply_markup: {
                                    remove_keyboard: true
                                }
                            })
                            this.chatStates[chatId] = 'start'
                        } else if (text === 'Попробовать бесплатно') {
                            if (this.done) {
                                await done(this.bot, chatId)
                                channel.ack(msg)
                                return
                            }
                            await this.bot.sendMessage(chatId, 'Спасибо! Ваш тариф будет активирован в скором времени!')
                            setTimeout(async () => {
                                await this.bot.sendMessage(chatId, 'Тариф активирован')
                            }, 5000)
                        }
                        break
                    default:
                        await this.bot.sendMessage(chatId, 'Что-то пошло не так...')
                        this.chatStates[chatId] = 'start'
                }

                if (['Базовый', 'Продвинутый', 'Pro'].includes(text)) {
                    if (this.done) {
                        await done(this.bot, chatId)
                        channel.ack(msg)
                        return
                    }
                    await this.bot.sendMessage(chatId, `Спасибо за выбор тарифа ${text}, отправим сообщение по активации`,  {
                        reply_markup: {
                            remove_keyboard: true
                        }
                    })
                    this.done = true
                    setTimeout(async () => {
                        await this.bot.sendMessage(chatId, 'Тариф активирован')
                    }, 5000)
                } else if (text === 'back') {
                    await startState(this.bot, chatId)
                    this.chatStates[chatId] = 'chooseTariff'
                }
            }

            channel.ack(msg)
        }, { noAck: false })
    }
}