'use strict';

/* 返回后端的一些 Q&A  直接把dataInit里面的数据返回前端显示就好了  */

import ExplainModel from '../../models/v3/explain'

class Explain {
	constructor(){

	}
	async getExpalin(req, res, next){
		try{
			const explain = await ExplainModel.findOne();
			res.send(explain.data)
		}catch(err){
			console.log('获取服务中心数据失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_SERVER_DATA',
				message: '获取服务中心数据失败'
			})
		}
	}
}

export default new Explain()