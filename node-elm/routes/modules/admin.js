'use strict';

import express from 'express'
import Admin from '../../controller/admin/admin'
import Check from '../../middlewares/check'
const router = express.Router()

router.get('/login', Admin.login);
router.get('/register', Admin.register);
router.get('/singout', Admin.singout);
router.get('/all', Admin.getAllAdmin);
router.get('/count', Admin.getAdminCount);
router.get('/info', Admin.getAdminInfo);
router.post('/update/avatar/:admin_id', Admin.updateAvatar);
router.delete('/delAdmin', Check.checkSuperAdmin, Admin.delAdmin);

export default router