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
