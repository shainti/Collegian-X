require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const getUrls = async () => {
  const result = await cloudinary.search
    .expression('folder:student-profiles')
    .max_results(200)
    .execute();

  result.resources.forEach(img => {
    console.log(`${img.public_id} → ${img.secure_url}`);
  });
};

getUrls().catch(console.error);