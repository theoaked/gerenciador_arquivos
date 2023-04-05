const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'D:/armazenamento_node/' });

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  fs.readdir('D:/armazenamento_node/', (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao listar arquivos.');
      return;
    }
    res.render('index', { files });
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).send('Selecione um arquivo.');
    return;
  }
  const filePath = file.path;
  const fileName = file.originalname;
  const ext = path.extname(fileName);
  const baseName = path.basename(fileName, ext);
  let newFileName = fileName;
  let count = 1;
  while (fs.existsSync(`D:/armazenamento_node/${newFileName}`)) {
    newFileName = `${baseName}_${count}${ext}`;
    count++;
  }
  fs.rename(filePath, `D:/armazenamento_node/${newFileName}`, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao fazer upload do arquivo.');
      return;
    }
    res.redirect('/');
  });
});

app.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = `D:/armazenamento_node/${fileName}`;
  res.download(filePath);
});

app.get('/delete/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = `D:/armazenamento_node/${fileName}`;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao excluir o arquivo.');
      return;
    }
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000.');
});
