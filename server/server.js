import app from './api/config.js';
import propertiesRouter from './Routes/properties.js';

// Rutas
app.use('/api/properties', propertiesRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});