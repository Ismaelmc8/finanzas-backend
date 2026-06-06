import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.xls', '.xlsx', '.csv'];
  const ext = path.extname(file.originalname);
  cb(null, allowed.includes(ext));
};

export default multer({ storage, fileFilter });
