import app from "./app";
app.listen(process.env.PORT, () => {
  console.log(
    `authentication port is running on port http://localhost:${process.env.PORT}`
  );
});
