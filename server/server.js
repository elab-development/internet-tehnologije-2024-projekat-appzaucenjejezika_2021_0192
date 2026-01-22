import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import coursesRoutes from './routes/courses.routes.js';

dotenv.config();

@@ -20,6 +21,7 @@ app.use(
);

app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

await mongoose.connect(process.env.MONGO_URI);
