import app from './app';
import { connectDB } from './utils/logger';

const PORT = process.env.PORT || 5000;



  app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});