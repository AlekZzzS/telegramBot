export async function choiceTariff(bot, chatId) {
    await bot.sendMessage(chatId, 'Выберите тариф:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Базовый', callback_data: 'Базовый' }],
                [{ text: 'Продвинутый', callback_data: 'Продвинутый' }],
                [{ text: 'Pro', callback_data: 'Pro' }],
                [{ text: 'Назад', callback_data: 'back' }]
            ],
            resize_keyboard: true
        }
    })
}