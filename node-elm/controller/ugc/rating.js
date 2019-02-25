'use strict';

/* 评论 */

import RatingModel from '../../models/ugc/rating'

class Rating {
	constructor(){
		this.type = ['ratings', 'scores', 'tags'];
		this.getRatings = this.getRatings.bind(this);
		this.getScores = this.getScores.bind(this);
		this.getTags = this.getTags.bind(this);
	}
	// 直接调用模型的方法初始化数据
	async initData(restaurant_id){
		try{
			const status = await RatingModel.initData(restaurant_id);
			if (status) {
				console.log('初始化评论数据成功');
			}
		}catch(err){
			console.log('初始化评论数据失败');
			throw new Error(err);
		}
	}
	// 根据餐馆id来获取参观的评价
	async getRatings(req, res, next){
		const restaurant_id = req.params.restaurant_id;
		if (!restaurant_id || !Number(restaurant_id)) {
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: '餐馆ID参数错误'
			})
			return
		}
		try{
			const ratings = await RatingModel.getData(restaurant_id, this.type[0]);
			res.send(ratings)
		}catch(err){
			console.log('获取评论列表失败', err);
			res.send({
				status: 0,
				type: "ERROR_DATA",
				message: '未找到当前餐馆的评论数据'
			})
		}
	}
	// 根据餐馆id来获取参观的分数
	async getScores(req, res, next){
		const restaurant_id = req.params.restaurant_id;
		if (!restaurant_id || !Number(restaurant_id)) {
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: '餐馆ID参数错误'
			})
			return
		}
		try{
			const scores = await RatingModel.getData(restaurant_id, this.type[1]);
			res.send(scores)
		}catch(err){
			console.log('获取评论列表失败', err);
			res.send({
				status: 0,
				type: "ERROR_DATA",
				message: '未找到当前餐馆的评论数据'
			})
		}
	}
	// 根据餐馆id来获取参观的标签
	async getTags(req, res, next){
		const restaurant_id = req.params.restaurant_id;
		if (!restaurant_id || !Number(restaurant_id)) {
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: '餐馆ID参数错误'
			})
			return
		}
		try{
			const tags = await RatingModel.getData(restaurant_id, this.type[2]);
			res.send(tags)
		}catch(err){
			console.log('获取评论列表失败', err);
			res.send({
				status: 0,
				type: "ERROR_DATA",
				message: '未找到当前餐馆的评论数据'
			})
		}
	}
}

export default new Rating()