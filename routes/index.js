import authRoutes from "./authRoutes.js";
import studentProfileRoutes from "./studentProfileRoutes.js";
import companyProfileRoutes from "./companyProfileRoutes.js";
import likedRoutes from "./likedRoutes.js";
import userProfileRoutes from "./userProfileRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const registerRoutes = (app) => {
  const API_PREFIX = "/api/v1";

  app.get(`${API_PREFIX}/health`, (req, res) => {
    res.status(200).json({
      status: "ok",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  app.use(`${API_PREFIX}/auth`, authRoutes);

  app.use(`${API_PREFIX}/students`, studentProfileRoutes);
  app.use(`${API_PREFIX}/companies`, companyProfileRoutes);
  app.use(`${API_PREFIX}/likes`, likedRoutes);
  app.use(`${API_PREFIX}/users`, userProfileRoutes);
  app.use(`${API_PREFIX}/uploads`, uploadRoutes);

  app.all(`${API_PREFIX}/*`, (req, res) => {
    res.status(404).json({
      status: 404,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  });
};

export default registerRoutes;
