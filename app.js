const express = require("express");
const routeModules = require("./modules");

const app = express();

//middleware
app.use(express.json());

//routes
app
  .route("/api/v1/posts")
  .get(routeModules.getAllPosts)
  .post(routeModules.createPost);

app
  .route("/api/v1/posts/:id")
  .get(routeModules.getPost)
  .patch(routeModules.updatePieceOfPost)
  .put(routeModules.updatePost)
  .delete(routeModules.deletePost);

const port = 3000;
app.listen(port, () => {
  console.log(`App is listening port ${port}`);
});
