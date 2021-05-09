import * as yargs from 'yargs';
import * as chalk from 'chalk';
import * as net from 'net';
import {RequestType, ResponseType} from './diferentesTipos';

/**
   * Funcion encargada de escribir en un determinado color
   * @param texto Texto que se desea escribir
   * @param color Color deseado
   * @param inverse Invertir el color al escribir
   */
 function escribirColor(texto :string, color :string, inverse :boolean = false) {
  switch (color) {
    case 'yellow':
      console.log(
        (inverse) ? chalk.yellow.inverse(texto) : chalk.yellow(texto),
      );
      break;

    case 'green':
      console.log(
        (inverse) ? chalk.green.inverse(texto) : chalk.green(texto),
      );
      break;

    case 'red':
      console.log(
        (inverse) ? chalk.red.inverse(texto) : chalk.red(texto),
      );
      break;
    
    case 'blue':
      console.log(
        (inverse) ? chalk.blue.inverse(texto) : chalk.blue(texto),
      );
      break;
  }
}

/**
 * Establecemos conexión con el servidor
 */
const socket = net.connect({port: 60300});
socket.on('error', () => {
  console.log(`Ha ocurrido un error con el servidor`);
});

/**
 * Respuesta del servidor  x
 */
socket.on('data', (data) => {
  const ResponseData: ResponseType = JSON.parse(data.toString());
  switch (ResponseData.tipo) {
    case 'add':
      if ( ResponseData.exito) {
        console.log(chalk.green(`Nueva nota creada`));
      } else {
        if (!ResponseData.color) {
          console.log(chalk.red(`Ha habido un problema con el color`));
        } else {
          console.log(chalk.red(`Ha ocurrido un error con la nota`));
        }
      }
      break;
    case 'read':
      if ( ResponseData.exito) {
        console.log(
            chalk.green(`${ResponseData.notas![0].titulo} se ha leido correctamente`),
        );

        escribirColor(ResponseData.notas![0].titulo,ResponseData.notas![0].color!,true,);

        escribirColor(`${ResponseData.notas![0].contenido}`,`${ResponseData.notas![0].color}`,);
      } else {
        console.log(chalk.red(`Nota no encontrada`));
      }
      break;
    case 'list':
      if ( ResponseData.exito) {
        console.log(
            chalk.green(`Se ha leido correctamente`),
        );
        console.log(
            chalk.white.inverse(`Notas`),
        );
        ResponseData.notas?.forEach((element) => {
          escribirColor(element.titulo, element.color!);
        });
      } else {
        console.log(chalk.red(`Ha ocurrido un error`));
      }
      break;
    case 'remove':
      if ( ResponseData.exito) {
        console.log(
            chalk.green(`Nota eliminada`),
        );
      } else {
        console.log(chalk.red(`Ha ocurrido un error`));
      }
      break;
    default:
        break;
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