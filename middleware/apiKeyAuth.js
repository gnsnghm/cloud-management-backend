// middleware/apiKeyAuth.js
const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
};

module.exports = apiKeyAuth;
