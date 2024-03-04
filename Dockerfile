FROM node:latest

# Установка необходимых пакетов для загрузки и установки ngrok
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Загрузка и установка ngrok
RUN wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz

RUN tar -xvf ngrok-v3-stable-linux-amd64.tgz -C /usr/local/bin
# Создание рабочего каталога и установка зависимостей Node.js
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

# Копирование остальных файлов приложения
COPY . .

# Команда для запуска вашего приложения
CMD npm run start