import * as net from 'net';
import {RequestEventEmitterServer} from './requestEventEmitterServer';
import {Notas} from './notas';

const notas: Notas = Notas.getNotas();

const server = net.createServer((connection) => {
  const serverEvent = new RequestEventEmitterServer(connection);
  console.log('Se ha conectado');

  serverEvent.on('request', (peticion) => {
    switch (peticion.type) {
      case 'add':
        const respuesta = notas.anadirNotas(peticion.usuario, peticion.titulo, peticion.contenido, peticion.color);
        connection.write(respuesta);
        break;

      case 'remove':
      connection.write(notas.eliminarNota(peticion.usuario, peticion.title));
      break;

      case 'list':
        connection.write(notas.listarNotas(peticion.usuario));
        break;

      case 'read':
        connection.write(notas.leerNotas(peticion.usuario, peticion.titulo));
        break;

      default:
        connection.write(notas.listarNotas(peticion.usuario));
        break;
    }
  });

  connection.on('close', () => {
    console.log('Un cliente se ha desconectado');
  });
});

server.listen(60300, () => {
  console.log('Esperando que se conecten al servidor');
});
