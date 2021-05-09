import * as chalk from 'chalk';
import * as fs from 'fs';
import {NotasJSON, ResponseType} from './diferentesTipos';

/**
 * Clase Notas
 */
 export class Notas {

  /**
   * Atributo notas
   */
  private static notas: Notas;

  /**
   * Constructor de la clase
   */
  private constructor() {}

  /**
   * Funcion para obtener el objeto notas
   * @returns el objeto notas
   */
  public static getNotas(): Notas {
    if (!fs.existsSync(`./notas`)) {
      fs.mkdirSync(`./notas`, {recursive: true});
    }
    if (!Notas.notas) {
      Notas.notas = new Notas();
    }
    return Notas.notas;
  };

  /**
   * Añadir una nota
   * @param usuario Nombre del usuario que crea la nota
   * @param titulo Titulo de la nota
   * @param contenido Contenido de la nota
   * @param color Color de la nota
   */
  anadirNotas(usuario :string, titulo :string, contenido :string, color :string) {
    if (!this.comprobarColor(color) ) {
      const ResponseJSON: ResponseType = {
        tipo: 'add',
        exito: false,
        color: false,
      };

      console.log('Color invalido');
      return JSON.stringify(ResponseJSON);
    };

    const texto = `{ "titulo": "${titulo}", "contenido": "${contenido}" , "color": "${color}" }`;

    if (fs.existsSync(`./notes/${usuario}`)) {
      if (!fs.existsSync(`./notes/${usuario}/${titulo}`)) {
        fs.writeFileSync(`./notes/${usuario}/${titulo}`, texto);

        const NoteRespondJSON: NotasJSON = {
          usuario: `${usuario}`,
          titulo: `${titulo}`,
        };

        const ResponseJSON: ResponseType = {
          tipo: 'add',
          exito: true,
          notas: [NoteRespondJSON],
          color: true,
        };

        console.log(`Nota creada`);
        return JSON.stringify(ResponseJSON);
      } else {
        const ResponseJson :ResponseType = {
          tipo: 'add',
          exito: false,
          color: true,
        };

        console.log(`Ha ocurrido un error`);
        return JSON.stringify(ResponseJson);
      };
    } else {
      fs.mkdirSync(`./notes/${usuario}`, {recursive: true});
      fs.writeFileSync(`./notes/${usuario}/${titulo}`, texto);

      const NoteRespondJSON: NotasJSON = {
        usuario: `${usuario}`,
        titulo: `${titulo}`,
      };

      const ResponseJSON: ResponseType = {
        tipo: 'add',
        exito: true,
        notas: [NoteRespondJSON],
        color: true,
      };

      console.log(`Nota creada`);
      return JSON.stringify(ResponseJSON);
    }
  };

  /**
   * Elimina una nota determinada
   * @param usuario Usuario que ha escrito la nota
   * @param titulo Titulo de la nota a eliminar
   * @returns El resultado de la operacion: Si se ha eliminado o no se ha podido eliminar
   */
     eliminarNota(usuario :string, titulo :string) {
      if (fs.existsSync(`./notas/${usuario}/${titulo}`)) {
        console.log('Nota eliminada');

        fs.rmSync(`./notas/${usuario}/${titulo}`);
        const ResponseJSON: ResponseType = {
          tipo: 'remove',
          exito: true,
        };

        return JSON.stringify(ResponseJSON);
      } else {
        console.log(`Nota no encontrada`);
        const ResponseJSON :ResponseType = {
          tipo: 'remove',
          exito: false,
        };
        return JSON.stringify(ResponseJSON);
      }
    }

  /**
   * Lista las notas de un usuario
   * @param usuario Usuario autor de las notas que se buscan
   * @returns Listado con las notas de dicho usuario
   */
   listarNotas(usuario :string) {
    if (fs.existsSync(`./notas/${usuario}`)) {
      console.log(chalk.white.inverse('Notas:'));
      let lista = '';

      fs.readdirSync(`./notas/${usuario}/`).forEach((note) => {
        const data = fs.readFileSync(`./notas/${usuario}/${note}`);
        const dataJSON = JSON.parse(data.toString());

        lista = lista + dataJSON.titulo + '\n';
        this.escribirColor(`- ${dataJSON.titulo}`, dataJSON.color);
      });
      return lista;
    } else {
      console.log(`No existe el usuario`);
      return 'No existe el usuario';
    }
  }

  /**
   * Leer una nota
   * @param usuario Usuario que ha escrito la nota 
   * @param titulo Titulo de la nota
   * @returns el contenido de la nota
   */
  leerNotas(usuario :string, titulo :string) {
    if (fs.existsSync(`./notas/${usuario}/${titulo}`)) {
      console.log(chalk.white.inverse('Notas:'));
      const ResponseNotesJSON: NotasJSON[] = [];

      fs.readdirSync(`./notas/${usuario}/`).forEach((element) => {
        const ResponseNoteJSON: NotasJSON = {
          usuario: '',
          titulo: '',
        };

      const data = fs.readFileSync(`./notas/${usuario}/${titulo}`);
      const dataJSON = JSON.parse(data.toString());

      ResponseNoteJSON.titulo = `${dataJSON.title}`;
      ResponseNoteJSON.color = `${dataJSON.color}`;
      ResponseNotesJSON.push(ResponseNoteJSON);

      this.escribirColor(`${dataJSON.title}`, dataJSON.color);
    });
    const ResponseJSON: ResponseType = {
      tipo: 'list',
      exito: true,
      notas: ResponseNotesJSON,
    };

    return JSON.stringify(ResponseJSON);
   } else {
    const ResponseJSON :ResponseType = {
      tipo: 'list',
      exito: false,
    };
      console.log('Nota no encontrada');
      return JSON.stringify(ResponseJSON);
    }
  }

  /**
   * Funcion encargada de escribir en un determinado color
   * @param texto Texto que se desea escribir
   * @param color Color deseado
   * @param inverse Invertir el color al escribir
   */
  escribirColor(texto :string, color :string, inverse :boolean = false) {
    switch (color) {
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

      case 'yellow':
        console.log(
          (inverse) ? chalk.yellow.inverse(texto) : chalk.yellow(texto),
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
   * Funcion encargada de verificar si el color deseado es aceptado por el programa
   * @param color Color deseado
   * @returns Si es aceptado o no
   */
  comprobarColor(color :string) {
    const bool = true;
    switch (color) {
      case 'green':
        return bool;
      case 'red':
        return bool;
      case 'yellow':
        return bool;
      case 'blue':
        return bool;
    }
    return false;
  }
};