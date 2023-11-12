const express = require('express');
const {
  getAllUser,
  creatNewUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// sign Up route

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// that middleware will protect all the routes that come after this.
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// middleware
router.use(authController.restrictTo('admin'));

router.route('/').get(getAllUser).post(creatNewUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
