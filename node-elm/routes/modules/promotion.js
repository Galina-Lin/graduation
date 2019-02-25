'use strict';

import express from 'express';
import Hongbao from '../../controller/promotion/hongbao'
import Balance from '../../controller/balance/balance'
const router = express.Router();

router.get('/v2/users/:user_id/hongbaos', Hongbao.getHongbao)
router.get('/v2/users/:user_id/expired_hongbaos', Hongbao.getExpiredHongbao)

router.get('/recharge/:user_id', Balance.updateBalance)

export default router