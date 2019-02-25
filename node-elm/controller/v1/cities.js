'use strict';

import Cities from '../../models/v1/cities'
import pinyin from "pinyin"
import AddressComponent from '../../prototype/addressComponent'


class CityHandle extends AddressComponent{
	constructor(){
		super()
		this.getCity = this.getCity.bind(this);
		this.getExactAddress = this.getExactAddress.bind(this);
		this.pois = this.pois.bind(this);
	}
	// 根据查询参数的不同返回各自对应的数据
	async getCity(req, res, next){
		const type = req.query.type;
		let cityInfo;
		try{
			switch (type){
				case 'guess': 
					const city = await this.getCityName(req);
					cityInfo = await Cities.cityGuess(city);
					break;
				case 'hot': 
					cityInfo = await Cities.cityHot();
					break;
				case 'group': 
					cityInfo = await Cities.cityGroup();
					break;
				default: 
					res.json({
						name: 'ERROR_QUERY_TYPE',
						message: '参数错误',
					})
					return
			}
			res.send(cityInfo);
		}catch(err){
			res.send({
				name: 'ERROR_DATA',
				message: '获取数据失败',
			});
		}
	}
	// 调用模型的getCityById来通过cities/1获取1去查询对应的城市信息
	async getCityById(req, res, next){
		const cityid = req.params.id;
		if (isNaN(cityid)) {
			res.json({
				name: 'ERROR_PARAM_TYPE',
				message: '参数错误',
			})
			return
		}
		try{
			const cityInfo = await Cities.getCityById(cityid);
			res.send(cityInfo);
		}catch(err){
			res.send({
				name: 'ERROR_DATA',
				message: '获取数据失败',
			});
		}
	}
	// 获取IP位置信息
	async getCityName(req){
		let cityInfo;
		try{
			cityInfo = await this.guessPosition(req); 
			// 这一步是通过prototype文件里面用腾讯通过IP获取地址得到的位置信息
		}catch(err){
			console.error('获取IP位置信息失败', err);
			res.send({
				name: 'ERROR_DATA',
				message: '获取数据失败',
			});
			return 
		}
		/*
		汉字转换成拼音
		 */
        const pinyinArr = pinyin(cityInfo.city, {
		  	style: pinyin.STYLE_NORMAL,
		});
		let cityName = '';
		pinyinArr.forEach(item => {
			cityName += item[0];
		})
		return cityName
	}
	// 获取精确的位置信息
	async getExactAddress(req, res, next){
		try{
			const position = await this.geocoder(req)
			res.send(position);
		}catch(err){
			console.log('获取精确位置信息失败');
			res.send({
				name: 'ERROR_DATA',
				message: '获取精确位置信息失败',
			});
		}
	}
	// 获取信息列表 就好像你在地图选点 然后会返回一个列表给你选地址那个
	async pois(req, res, next){
		const geohash = req.params.geohash;
		try{
			if (geohash.indexOf(',') == -1) {
				throw new Error('参数错误')
			}
		}catch(err){
			console.log('参数错误');
			res.send({
				status: 0,
				type: 'ERROR_PARAMS',
				message: '参数错误',
			})
			return 
		}
		const poisArr = geohash.split(',');
		try{
			const result = await this.getpois(poisArr[0], poisArr[1]);
			const address = {
				address: result.result.address,
				city: result.result.address_component.province,
				geohash,
				latitude: poisArr[0],
				longitude: poisArr[1],
				name: result.result.formatted_addresses.recommend,
			}
			res.send(address);
		}catch(err){
			console.log('getpois返回信息失败');
			res.send({
				status: 0,
				type: 'ERROR_DATA',
				message: '获取数据失败',
			})
		}
	}
}
export default new CityHandle()