//npm i cloudinary => allows you to quickly and easily integrate your application with Cloudinary

//npm i multer-storage-cloudinary =>multer storage engine for Cloudinary

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
    params: {
      folder: 'CasaRentals_DEV2',
      allowerdFormats: ["png","jpg","jpeg"],
    },
  });

  module.exports={
    cloudinary,
    storage
  }