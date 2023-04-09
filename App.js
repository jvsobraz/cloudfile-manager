const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();
const s3 = new AWS.S3({
  accessKeyId: 'YOUR_ACCESS_KEY', // substitua com sua Access Key do Amazon S3
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY', // substitua com sua Secret Access Key do Amazon S3
  region: 'us-east-1' // substitua com a região do seu bucket do Amazon S3
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'YOUR_BUCKET_NAME', // substitua com o nome do seu bucket do Amazon S3
      acl: 'public-read', // define as permissões de acesso aos arquivos
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + '-' + file.originalname);
      }
    })
  });
  
  // Rota de upload de arquivo
app.post('/upload', upload.single('file'), (req, res, next) => {
    // Lógica para manipular o arquivo enviado para o Amazon S3
    // Você pode adicionar metadados, gerar URLs de download, etc.
    res.json({ message: 'Arquivo enviado com sucesso' });
  });
  
// Rota de download de arquivo
app.get('/download/:key', (req, res, next) => {
    const params = {
      Bucket: 'YOUR_BUCKET_NAME', // substitua com o nome do seu bucket do Amazon S3
      Key: req.params.key // substitua com o nome da chave do arquivo a ser baixado
    };
    s3.getObject(params, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao baixar arquivo' });
      } else {
        res.attachment(data.Metadata.originalname);
        res.send(data.Body);
      }
    });
  });
  
  // Rota de exclusão de arquivo
  app.delete('/delete/:key', (req, res, next) => {
    const params = {
      Bucket: 'YOUR_BUCKET_NAME', // substitua com o nome do seu bucket do Amazon S3
      Key: req.params.key // substitua com o nome da chave do arquivo a ser excluído
    };
    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir arquivo' });
      } else {
        res.json({ message: 'Arquivo excluído com sucesso' });
      }
    });
  });
  
  // Rota de listagem de arquivos
  app.get('/list', (req, res, next) => {
    const params = {
      Bucket: 'YOUR_BUCKET_NAME' // substitua com o nome do seu bucket do Amazon S3
    };
    s3.listObjects(params, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao listar arquivos' });
      } else {
        const files = data.Contents.map(file => ({
          key: file.Key,
          originalname: file.Metadata.originalname
        }));
        res.json(files);
      }
    });
  });
  
  // Adicione outras rotas de API para gerenciamento de arquivos, compartilhamento, etc.
  
  // Inicie o servidor
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
  