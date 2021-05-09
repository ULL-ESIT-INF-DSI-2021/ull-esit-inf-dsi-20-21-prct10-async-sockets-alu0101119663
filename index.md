# Informe práctica 10 - Cliente y servidor para una aplicación de procesamiento de notas de texto


## Introducción
Durante esta práctica implementaremos una aplicación de procesamiento de notas haciendo uso de un servidor y un cliente usando sockest proporcionados por el módulo de Node.js **net**.

## Antes de empezar
Antes de empezar, hemos de crear la estructura. Para ello nos haremos los mismos pasos que llevamos haciendo durante el transcurso del tiempo, en bibliografía estarán los enlaces que hemos estado siguiendo.

## Guion de la práctica 
[Guión de la práctica](https://ull-esit-inf-dsi-2021.github.io/prct10-async-sockets/)

### diferentesTipos.js
Pulse [aquí](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101119663/blob/master/src/diferentesTipos.ts) para acceder al código.

```
export type NotasJSON = {
  usuario: string;
  titulo: string;
  contenido?: string;
  color?: string;
}

export type RequestType = {
  tipo: 'add' | 'update' | 'remove' | 'read' | 'list';
  usuario: string,
  titulo?: string;
  contenido?: string;
  color?: string;
};

export type ResponseType = {
  tipo: 'add' | 'update' | 'remove' | 'read' | 'list';
  exito: boolean;
  color?: boolean
  notas?: NotasJSON[];
};
```
En este fichero encontramos los diferentes tipos que utilizaremos a lo largo de la práctica. En NotasJSON tenemos almacenado el usuario, el titulo, el contenido y el color de la nota. En RequestType tenemos el tipo de peticion junto a los anteriores mencionados en NotasJSON. Y por último en la respuesta que nos dará, ResponseType, tenemos el tipo de acción, si ha tenido éxito dicha acción, el color donde verificamos si el color que hemos introducido es válido o no y por último contemplamos una array de notas.

### cliente.ts
Pulse [aquí](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101119663/blob/master/src/cliente.ts) para acceder al código.

```
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import * as net from 'net';
import {RequestType, ResponseType} from './diferentesTipos';

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

const socket = net.connect({port: 60300});
socket.on('error', () => {
  console.log(`Ha ocurrido un error con el servidor`);
});

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

 yargs.argv;
```
Para ser más concreto, comentaré lo nuevo que se ha añadido ya que parte del código es extraido de prácticas anteriores. La primera función que tenemos *escribirColor* que ha sido descrita en prácticas anteriores. Y tras ella, establecemos conexión con el socket y comprobamos si ha habido algún error. Si no ocurre ningún fallo lo que se realiza es obtener el Request, en él se almacenará la información que captaremos con **yargs** en el comando. En caso de que la peticion sea un *add* se recoge, el tipo de peticion, el usuario de la nota, el titulo de la nota, el contenido de la nota y por último su color. Tras esto el write del socket enviaremos la información ayudados tambien con *stringify* que transformará el contenido de estilo JSON a un string.
En la respuesta de la solicitud, hacemos que el socket escuche para recibir los datos y con un callback detectará la información. Con la ayuda del type de respuesta anteriormente descrito, podemos saber como ha ido la operación. Una vez se ha ejecutado la línea `socket.end` se comunica que se ha recibido el mensaje de forma correcta.

### servidor.ts
Pulse [aquí](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101119663/blob/master/src/servidor.ts) para acceder al código.
```
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
```
Lo primero que hacemos es crear el servidor con el que trabajaremos, tras ello le pasamos al servido qué puerto debe de escuchar. Una vez hemos establecido la conexión lo que hacemos es llamar a la clase *RequestEventEmitterServer* que describimos a continuación. Tras haber creado una instancia lo que hacemos es notificar al usuario de que se ha establicido la conexión, y tras haber detectado un evento se procesa la petición recogida.

### requestEventEmitterServer
Pulse [aquí](https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101119663/blob/master/src/requestEventEmitterServer.ts) para acceder al código.

```
import {EventEmitter} from 'events';

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
```
En esta clase lo que haremos será gestionar los eventos del programa. Emite el evento cuando se ha detectado que el usuario ha hecho una petición de forma correcta.

### claseCliente.ts y pruebaTest.ts
Lo que se ha realizado en estos dos fichero ha sido una implementación para realizar los test de forma cómoda y según nuestros intereses. Para ello se crea un nuevo evento que ya tiene la respuesta del servidor procesada.

## Conclusion
Durante la realización de esta práctica he entendido mejor los conocimientos vistos en clase y como he indicado al profesor Eduardo Segrede en un correo me hubiera gustado tener un poco más de tiempo para mejorar el código y poder realizar un poco mejor este informe, por ello pido disculpas. Resaltar que creo que ha sido una buena idea modificar un poco el código para hacer que las pruebas con Mocha sean más cómoda.


