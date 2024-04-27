import { readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const models = {};
const filePath = fileURLToPath(import.meta.url);
const pathDir = dirname(filePath);
const PATH_MODELS = join(pathDir, 'mysql');
// Función que elimina la extensión del nombre de archivo
const removeExtension = (fileName) => fileName.split('.').shift();

// Lee los archivos de la carpeta y crea un modelo por cada uno
readdirSync(PATH_MODELS).forEach((file) => {
  const name = removeExtension(file);

  // Importa el archivo de modelo dinámicamente
  import(`./mysql/${file}`)
    .then((module) => {
      // Agrega el modelo al objeto models
      models[`${name}`] = module.defaut;
    })
    .catch((err) => {
      console.error(`Error importing model file ${file}:`, err);
    });
});
export default models;
