'use strict';

import mongoose from 'mongoose';
import cityData from '../../InitData/cities'

const citySchema = new mongoose.Schema({
	data: {}
}); 
// 通过腾讯api的返回结果对应找出在initData中的那个数据
citySchema.statics.cityGuess = function(name){
	return new Promise(async (resolve, reject) => {
		const firtWord = name.substr(0,1).toUpperCase();
		try{
			const city = await this.findOne();
			Object.entries(city.data).forEach(item => {
				if(item[0] == firtWord){
					item[1].forEach(cityItem => {
						if (cityItem.pinyin == name) {
							resolve(cityItem);
						}
					})
				}
			})
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败 定位不到你的城市',
			});
			console.error(err);
		}
	})
}

// 哈哈 这里只是去读取我们文件里面hotCitese而已 findone充当数据库 其实是读取本地问价
citySchema.statics.cityHot = function (){
	return new Promise(async (resolve, reject) => {
		try{
			const city = await this.findOne();
			resolve(city.data.hotCities)
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败 找不到热点城市',
			});
			console.error(err);
		}
	})
}

// 除去热点城市和id 直接把地址文件返回
citySchema.statics.cityGroup = function (){
	return new Promise(async (resolve, reject) => {
		try{
			const city = await this.findOne();
			const cityObj = city.data;
			delete(cityObj._id)
			delete(cityObj.hotCities)
			resolve(cityObj)
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败',
			});
			console.error(err);
		}
	})
}

// 通过id来获取城市的位置
citySchema.statics.getCityById = function(id){
	return new Promise(async (resolve, reject) => {
		try{
			const city = await this.findOne();
			Object.entries(city.data).forEach(item => {
				if(item[0] !== '_id' && item[0] !== 'hotCities'){
					item[1].forEach(cityItem => {
						if (cityItem.id == id) {
							resolve(cityItem)
						}
					})
				}
			})
		}catch(err){
			reject({
				name: 'ERROR_DATA',
				message: '查找数据失败',
			});
			console.error(err);
		}
	})
}

const Cities = mongoose.model('Cities', citySchema);

// 重写了monogoose的findone 其实这里是直接读取本地文件 将本地文件作为monogoose的一个数据模型输出
Cities.findOne((err, data) => {
	if (!data) {
		Cities.create({data: cityData});
	}
});

export default Cities