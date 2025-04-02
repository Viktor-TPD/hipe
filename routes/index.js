import authRoutes from "./authRoutes.js";
import studentProfileRoutes from "./studentProfileRoutes.js";
import companyProfileRoutes from "./companyProfileRoutes.js";
import likedRoutes from "./likedRoutes.js";
import userProfileRoutes from "./userProfileRoutes.js";
import uploadRoutes from "./uploadRoutes.js";


const registerRoutes = (app) => {
  const API_PREFIX = "/api";

  app.use(`${API_PREFIX}`, authRoutes);
  app.use(`${API_PREFIX}`, studentProfileRoutes);
  app.use(`${API_PREFIX}`, companyProfileRoutes);
  app.use(`${API_PREFIX}`, likedRoutes);
  app.use(`${API_PREFIX}`, userProfileRoutes);
  app.use(uploadRoutes);
  app.use('/api', studentProfileRoutes);

  app.all(`${API_PREFIX}/*`, (req, res) => {
    res.status(404).json({
      status: 404,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  });
};

export default registerRoutes;
