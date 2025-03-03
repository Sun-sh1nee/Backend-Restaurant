const express = require('express');
const { getComments, updateComment, deleteComment, addComment, getComment } = require('../controllers/comments');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .get(getComments)
    .post(protect, authorize('admin','user') ,addComment);
router.route('/:id')
    .get(protect , getComment)
    .put(protect, authorize('admin','user') , updateComment)
    .delete(protect, authorize('admin','user') ,deleteComment);
module.exports = router;