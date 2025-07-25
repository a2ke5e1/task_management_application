import app from "./app";
import dbConnect from "./dbConnect";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
