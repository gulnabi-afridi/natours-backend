const express = require('express');
const {
  getAllUser,
  creatNewUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// sign Up route

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.route('/').get(getAllUser).post(creatNewUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
