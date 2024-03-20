const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'MTIyMDEyNDgxNzkxNTc3NzAzNA.Gxg0es.9q7hbDIgl-umDkO7D-PrXKJxQZfNp01aq4kA4g'; // Reemplaza 'TU_TOKEN' con el token de tu bot

client.on('ready', () => {
    console.log(`Bot iniciado como ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});

client.login(token);
node bot.js

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

// Estructura de datos para almacenar registros de fichaje
let registros = {};

// Función para crear un mensaje con botones de entrada y salida
function crearMensajeFichaje() {
    return new Discord.MessageEmbed()
        .setTitle('Fichaje')
        .setDescription('Haz clic en el botón correspondiente para fichar entrada o salida.')
        .setColor('#0099ff')
        .addField('Entrada', '\u200B', true)
        .addField('Salida', '\u200B', true);
}

// Comando para iniciar el fichaje
client.on('message', async message => {
    if (message.content.toLowerCase() === '!fichar') {
        const userId = message.author.id;
        const mensajeFichaje = await message.channel.send(crearMensajeFichaje());
        mensajeFichaje.react('➡️'); // Emoji para fichar entrada
        mensajeFichaje.react('⬅️'); // Emoji para fichar salida

        // Filtrar reacciones para identificar la fichaje de entrada o salida
        const filter = (reaction, user) => (reaction.emoji.name === '➡️' || reaction.emoji.name === '⬅️') && user.id === userId;
        const collector = mensajeFichaje.createReactionCollector(filter, { time: 60000 });

        collector.on('collect', (reaction, user) => {
            const horaActual = new Date().toLocaleTimeString();
            if (reaction.emoji.name === '➡️') {
                registros[userId] = { entrada: horaActual, salida: null };
                message.channel.send(`Has fichado entrada a las ${horaActual}`);
            } else if (reaction.emoji.name === '⬅️') {
                if (registros[userId]) {
                    registros[userId].salida = horaActual;
                    const totalHoras = calcularHorasTrabajadas(registros[userId].entrada, registros[userId].salida);
                    message.channel.send(`Has fichado salida a las ${horaActual}. Horas trabajadas hoy: ${totalHoras}`);
                    delete registros[userId];
                } else {
                    message.channel.send('Primero debes fichar entrada.');
                }
            }
            collector.stop();
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.channel.send('Tiempo de fichaje agotado.');
            }
            mensajeFichaje.delete();
        });
    }
});

// Función para calcular horas trabajadas
function calcularHorasTrabajadas(entrada, salida) {
    // Implementa tu lógica para calcular las horas trabajadas
    return 'X horas';
}

client.login('MTIyMDEyNDgxNzkxNTc3NzAzNA.Gxg0es.9q7hbDIgl-umDkO7D-PrXKJxQZfNp01aq4kA4g'); // Reemplaza 'TU_TOKEN' con el token de tu bot
