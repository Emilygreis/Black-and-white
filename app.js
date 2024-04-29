const express = require('express');
const { engine } = require('express-handlebars');
const jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.listen(3000, () => {
  console.log('El servidor está inicializado en el puerto 3000');
});

app.engine(
  "handlebars",
  engine({
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/componentes/",
  })
);

app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

app.get('/', async (req, res) => {
  res.render("Inicio", {
    layout: "Inicio",
  });
});

app.post('/black-and-white', async (req, res) => {
  try {
    const urlImagen = await generarImagen(req.body.url_imagen);
    res.render("Imagen", {
      layout: "Imagen",
      urlImagen: `imagenes/${urlImagen}`,
    });
  } catch (e) {
    console.log('Error: ', e);
    res.render("Error", {
      layout: "Error",
    });
  }
});

async function generarImagen(url_imagen) {
  const imagen = await jimp.read(url_imagen);
  const imageName = generarNombre();
  await imagen
    .resize(350, jimp.AUTO)
    .grayscale()
    .quality(80)
    .writeAsync(`${__dirname}/assets/imagenes/${imageName}`);
  return imageName;
}

function generarNombre() {
  const uuid = uuidv4();
  const nombre = uuid.replace(/-/g, '').substring(0, 6);
  return `${nombre}.jpg`;
}