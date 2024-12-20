import fs from 'fs';
import path from 'path';

export const saveTemporaryImage = (fileData: {
  base64Img: string;
  customer_code: string;
  measurement_type: string;
}): { fileName: string; filePath: string } => {
  const { base64Img, customer_code, measurement_type } = fileData;

  // Transform image to binary format and set it's path, name and expiry time
  const fileExt = base64Img.split('/')[1].split(';')[0];
  const fileName = `${customer_code}-${measurement_type.toLowerCase()}-${Date.now()}.${fileExt}`;
  const filePath = path.resolve(__dirname, '..', '..', 'public', fileName);
  const binaryImage = Buffer.from(base64Img.split(',')[1], 'base64');
  const expirationTime = 60 * 1000;

  // Save image binary
  fs.writeFileSync(filePath, binaryImage);

  // Start countdown to delete the image
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log(`${fileName} was successfully deleted`);
    });
  }, expirationTime);

  return { fileName, filePath };
};
