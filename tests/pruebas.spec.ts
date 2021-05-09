import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {Client} from '../src/claseCliente';
import {ResponseType} from '../src/diferentesTipos';

describe('MessageEventEmitterClient', () => {
  it('Se realiza la peticion add de forma correcta', (done) => {
    const socket = new EventEmitter();
    const client: Client = new Client(socket);

    client.on('response', (response) => {
      expect(response).to.be.eql('Nota creada');
    });

    const ResponseJSON: ResponseType = {
      tipo: 'add',
      exito: true,
      notas: [],
      color: true,
    };

    socket.emit('data', JSON.stringify(ResponseJSON));
    done();
  });

  it('Se detecta el error', (done) => {
    const socket = new EventEmitter();
    const client = new Client(socket);

    client.on('error', (error) => {
      expect(error).to.be.eql('Error del servidor');
    });

    socket.emit('error');
    done();
  });

  it('Se detecta error relacionado con el color', (done) => {
    const socket = new EventEmitter();
    const client = new Client(socket);

    client.on('response', (response) => {
      expect(response).to.be.eql('Ha ocurrido un error');
    });

    const ResponseJson :ResponseType = {
      tipo: 'add',
      exito: false,
      notas: [],
      color: true,
    };

    socket.emit('data', JSON.stringify(ResponseJson));
    done();
  });

  it('Se realiza la peticion read de forma correcta', (done) => {
    const socket = new EventEmitter();
    const client = new Client(socket);

    client.on('response', (response) => {
      expect(response).to.be.eql('Prueba abierto correctamente');
    });

    const ResponseJson :ResponseType = {
      tipo: 'read',
      exito: true,
      notas: [
        {
          usuario: 'Prueba',
          titulo: 'Prueba',
          contenido: 'Prueba',
          color: 'red',
        },
      ],
      color: false,
    };

    socket.emit('data', JSON.stringify(ResponseJson));
    done();
  });

  it('Se detecta error', (done) => {
    const socket = new EventEmitter();
    const client = new Client(socket);

    client.on('response', (response) => {
      expect(response).to.be.eql('Nota no encontrada');
    });

    const ResponseJson :ResponseType = {
      tipo: 'read',
      exito: false,
      notas: [],
      color: false,
    };

    socket.emit('data', JSON.stringify(ResponseJson));
    done();
  });
});