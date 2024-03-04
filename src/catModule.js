import axios from 'axios'

export async function getCat(bot, chatId, text) {
    bot.sendMessage(chatId, text ? 'Держи котика!' : 'Классная картинка! Держи котика!')
    let catImage = await axios.get('https://api.thecatapi.com/v1/images/search')
    catImage = catImage.data[0].url
    await bot.sendPhoto(chatId, catImage)

    await bot.sendMessage(chatId, 'А теперь вернемся к нашему вопросу! Или хотите ещё котиков?', {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    {text: 'Ещё котиков! 🐱', callback_data: 'котики'},
                    {text: 'Хочу выбрать тариф ⭐', callback_data: 'тариф'}
                ],
            ]
        })
    })
}