const router = require("express").Router();
const controller = require("-/blog.controller");
const { checkRole } = require("../../utils/sessionManager");
const { validate } = require("./blog.validator");
/* 
- get all blogs
- author specific blog
- add new blog
- delete a blog
- get one blog
- search blog
- bookmark blog
*/

router.get("/published-only", async (req, res, next) => {
  try {
    const { page, limit, title, author } = req.query;
    const result = await controller.getPublishedBlogsOnly(
      { title, author },
      page,
      limit
    );
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

router.get("/published-only", async (req, res, next) => {
  try {
    const { page, limit, title, author } = req.query;
    const result = await controller.getPublishedBlogsOnly(
      { title, author },
      page,
      limit
    );
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
  checkRole(["admin", "user"]),
  validate,
  async (req, res, next) => {
    try {
      req.body.author = req.body.author || req.currentUser;
      const result = await controller.create(req.body);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
