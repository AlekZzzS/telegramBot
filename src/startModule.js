export async function startState(bot, chatId) {
    await bot.sendMessage(chatId,'Добро пожаловать! Вы хотите приобрести тариф?', {
        reply_markup: {
            keyboard: [['Да', 'Нет', 'Попробовать бесплатно']],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    })
}