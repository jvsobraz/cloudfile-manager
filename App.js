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
  