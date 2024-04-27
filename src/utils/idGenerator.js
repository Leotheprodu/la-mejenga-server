const idGenerator = (length = 20) => {
  if (length <= 0) {
    throw new Error('La longitud debe ser mayor que 0');
  }

  const a = Date.now().toString(30);
  const b = Math.random().toString(30).substring(2);

  let id = a + b;

  if (id.length >= length) {
    // Hacemos un "slice" desde el final hacia atrás para obtener los últimos caracteres.
    return id.slice(-length);
  }
  // En caso de que la cadena generada sea más corta que la longitud deseada,
  // puedes rellenarla con caracteres adicionales si lo deseas.
  const filler = 'abcdefghijklmnopqrstuvwxyz'; // Caracteres a utilizar como relleno
  const fillerLength = filler.length;

  while (id.length < length) {
    const randomIndex = Math.floor(Math.random() * fillerLength);
    id += filler[randomIndex];
  }

  return id;
};

export default idGenerator;
