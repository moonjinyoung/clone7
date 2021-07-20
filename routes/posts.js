const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { post } = require('../models');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext);
    }
});

var upload = multer({ storage: storage});

router.get('/', async (req, res) => {
    const posts = await post.findAll({});
    res.send({ posts });
});

router.post('/post', upload.single("image"), async (req, res, next) => {
   const { userId } = res.locals.user;
   const { content } = req.body;
   const img = `/images/${req.file.filename}`;

   await post.create({ content, img, userId });

   res.send({ result: "success" });
});

router.put('/:postId', upload.single("image"), async (req, res) => {
    const { userId } = res.locals.user;
    const { content } = req.body;
    const { postId } = req.params;
    const img = `/images/${req.file.filename}`;

    const isExist = await post.findOne({
        where: { postId, userId }
    });

    if(isExist) {
        isExist.content = content;
        isExist.img = img;
        await isExist.save();
    } else {
        await post.create({ content, img, userId });
    }
    res.send({ result: "success" });
});

router.delete('/:postId', async (req, res) => {
   const { postId } = req.params;
   const { userId } = res.locals.user;

   const isExist = await post.findOne({
       where: { postId, userId }
   });
   if(isExist) {
       await isExist.destroy();
   }

   res.send({ result: "success" })
});

module.exports = router;