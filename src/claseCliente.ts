import * as chalk from 'chalk';
import {EventEmitter} from 'events';
import {ResponseType} from './diferentesTipos';

/**
 * Clase para gestionar eventos del cliente
 */
export class Client extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();

    connection.on('error', () => {
      this.emit('error', 'Error del servidor');
    });

    connection.on('data', (element) => {
      const ResponseData :ResponseType = JSON.parse(element.toString());
      switch (ResponseData.tipo) {
        case 'add':
          if ( ResponseData.exito) {
            this.emit('response', `Nota creada`, false);
          } else {
            if (!ResponseData.color) {
              this.emit('response', `Ha ocurrido un error`, true);
            } else {
              this.emit('response', `Ha ocurrido un error`, true);
            }
          }
          break;

        case 'read':
          if ( ResponseData.exito) {
            this.emit('response', `${ResponseData.notas![0].titulo} abierto correctamente`, true);
          } else {
            console.log(chalk.red(`Nota no encontrada`));
          }
          break;
      }
    });
  }
};