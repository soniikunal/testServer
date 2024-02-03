const handleServerError = (res, message = "Internal Server Error") => {
  return res.status(500).json({ error: message });
};

const handleNotFound = (res, message) => {
  return res.status(404).json({ error: message || "Not found" });
};

const successfullResponse = (res, message) => {
  return res.status(404).json({ error: message || "Not found" });
};

const generateUniqueCode= () => {
  const code = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
  return code.toString(); // Convert to string
}

export { handleServerError, handleNotFound, generateUniqueCode };
