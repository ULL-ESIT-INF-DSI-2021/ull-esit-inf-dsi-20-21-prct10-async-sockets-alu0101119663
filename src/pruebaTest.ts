import * as chalk from 'chalk';
import * as yargs from 'yargs';
import * as net from 'net';
import {RequestType} from './diferentesTipos';
import {Client} from './claseCliente';

const socket = net.connect({port: 60300});

const client: Client = new Client(socket);

/**
 * Evento response, con la respuesta una vez procesada
 */
client.on('response', (respuesta, error) => {
  if (!error) {
    console.log(chalk.green(respuesta));
  } else {
    console.log(chalk.red(respuesta));
  }
  socket.end();
});

/**
 * Comando para añadir una nota
 */
 yargs.command({
  command: 'add',
  describe: 'Añade una nueva nota',
  builder: {
    usuario: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
    contenido: {
      describe: 'Contenido de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string' && typeof argv.titulo === 'string' && typeof argv.contenido === 'string' && typeof argv.color === 'string') {
      const RequestJSON: RequestType = {
        tipo: 'add',
        usuario: `${argv.usuario}`,
        titulo: `${argv.titulo}`,
        contenido: `${argv.contenido}`,
        color: `${argv.color}`,
      };
      
      socket.write(JSON.stringify(RequestJSON) + `\n`);
    }
  },
});

/**
 * Comando para eliminar una nota
 */
 yargs.command({
  command: 'remove',
  describe: 'Elimina una nota',
  builder: {
    usuario: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string' && typeof argv.titulo === 'string') {
      const RequestJSON: RequestType = {
        tipo: 'remove',
        usuario: `${argv.usuario}`,
        titulo: `${argv.titulo}`,
      };

      socket.write(JSON.stringify(RequestJSON) + `\n`);
    }
  },
});

/**
 * Comando para listar las notas de un usuario
 */
 yargs.command({
  command: 'list',
  describe: 'Lista las notas de un usuario',
  builder: {
    usuario: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string') {
      const RequestJSON: RequestType = {
        tipo: 'list',
        usuario: `${argv.usuario}`,
      };

      socket.write(JSON.stringify(RequestJSON) + `\n`);
    }
  },
});

/**
 * Comando para leer una determinada nota
 */
 yargs.command({
  command: 'read',
  describe: 'Lee una nota',
  builder: {
    usuario: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
    titulo: {
      describe: 'Titulo de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.usuario === 'string' && typeof argv.titulo === 'string') {
      const RequestJSON: RequestType = {
        tipo: 'remove',
        usuario: `${argv.usuario}`,
        titulo: `${argv.titulo}`,
      };

      socket.write(JSON.stringify(RequestJSON) + `\n`);
    }
  },
});

/**
 * Le pasamos los argumentos a yargs
 */
 yargs.argv;