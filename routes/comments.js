const express = require('express');
const { getComments, updateComment, deleteComment, addComment } = require('../controllers/comments');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .post(protect, authorize('admin','user') ,addComment);
router.route('/:id')
    .get(protect ,getComments ,getComments)
    .put(protect, authorize('admin','user') , updateComment)
    .delete(protect, authorize('admin','user') ,deleteComment);
module.exports = router;