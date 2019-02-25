'use strict';

/* 处理钱的 */

import UserInfoModel from '../../models/v2/userInfo'
import BaseComponent from '../../prototype/BaseComponent'
import crypto from 'crypto'
import formidable from 'formidable'
import dtime from 'time-formater'

class Balance extends BaseComponent {
	constructor(){
		super()
	}
	async updateBalance(req, res, next){
		const user_id = req.params.user_id;
		if (!user_id || !Number(user_id)) {
			console.log('user_id参数错误', user_id)
			res.send({
				status: 0,
				type: 'ERROR_userID',
				message: 'user_id参数错误',
			})
			return 
		}

		try{
			const balance = req.query.balance;
			await UserInfoModel.findOneAndUpdate({ id: user_id }, { $set: { balance: balance}});
			res.send({
				status: 1,
				message: 'success'
			})
			return
		}catch(err){
			console.log('充值失败', err);
			res.send({
				status: 0,
				type: 'ERROR',
				message: '充值失败'
			})
			return
		}
	}
}

export default new Balance()