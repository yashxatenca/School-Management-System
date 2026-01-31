import app from "./app";
import dotenv from 'dotenv'

dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(
    `authentication port is running on port http://localhost:${process.env.PORT}`
  );
});
