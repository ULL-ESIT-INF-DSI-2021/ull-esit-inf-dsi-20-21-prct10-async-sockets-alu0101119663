import {EventEmitter} from 'events';

/**
 * Clase para gestionar eventos del eventemitter del argumento pasado
 */
export class RequestEventEmitterServer extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();
    let information = '';
    connection.on('data', (element) => {
      information += element;

      let aux = information.indexOf('\n');
      while (aux !== -1) {
        const mensaje = information.substring(0, aux);
        information = information.substring(aux + 1);
        this.emit('request', JSON.parse(mensaje));
        aux = information.indexOf('\n');
      }
    });
  };
}