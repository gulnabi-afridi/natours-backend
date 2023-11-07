const express = require('express');
const {
  getAllUser,
  creatNewUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
} = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// sign Up route

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

router.patch('/updateMe', authController.protect, updateMe);

router.route('/').get(getAllUser).post(creatNewUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
