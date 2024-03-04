export async function done(bot, chatId) {
    await bot.sendMessage(chatId, 'Вы уже выбрали тариф, хотите картинку котика?', {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: 'Да!', callback_data: 'котики'}
                ],
            ]
        }
    })
}