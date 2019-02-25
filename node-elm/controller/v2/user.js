'use strict';

import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'
import UserInfoModel from '../../models/v2/userInfo'
import UserModel from '../../models/v2/user'
import crypto from 'crypto'
import dtime from 'time-formater'
import RatingModel from '../../models/ugc/rating'

class User extends AddressComponent {
	constructor(){
		super()
		this.login = this.login.bind(this);
		this.encryption = this.encryption.bind(this);
		this.chanegPassword = this.chanegPassword.bind(this);
		this.updateAvatar = this.updateAvatar.bind(this);
		this.uploadAssessImg = this.uploadAssessImg.bind(this);
	}
	// 登录时用cookie的 cap 字段的验证码是否过期
	async login(req, res, next){
		const cap = req.cookies.cap;
		if (!cap) {
			console.log('验证码失效 已过期')
			res.send({
				status: 0,
				type: 'ERROR_CAPTCHA',
				message: '验证码失效',
			})
			return
		}
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {

			const {username, password, captcha_code} = fields;
			try{
				if (!username) {
					throw new Error('用户名参数错误');
				}else if(!password){
					throw new Error('密码参数错误');
				}else if(!captcha_code){
					throw new Error('验证码参数错误');
				}
			}catch(err){
				console.log('登陆参数错误', err);
				res.send({
					status: 0,
					type: 'ERROR_QUERY',
					message: err.message,
				})
				return
			}

			if (cap.toString() !== captcha_code.toString()) {
				res.send({
					status: 0,
					type: 'ERROR_CAPTCHA',
					message: '验证码不正确',
				})
				return
			}

			// 这里简单处理 就是当用户输入的账号和密码都是新的时候 就直接创一个新的账号 
			const newpassword = this.encryption(password);
			try{
				const user = await UserModel.findOne({username});
				// 创建一个新的用户
				if (!user) {

					const user_id = await this.getId('user_id');
					const cityInfo = await this.guessPosition(req);
					const registe_time = dtime().format('YYYY-MM-DD HH:mm');
					const newUser = {username, password: newpassword, user_id};
					const newUserInfo = {username, user_id, id: user_id, city: cityInfo.city, registe_time, };

					// 在user集合里面新建一个user
					UserModel.create(newUser);
					// 在userInfo里面插入一条新的用户信息
					const createUser = new UserInfoModel(newUserInfo);
					const userinfo = await createUser.save();

					req.session.user_id = user_id;
					res.send(userinfo);

				}else if (user.password.toString() !== newpassword.toString()) {

					console.log('用户登录密码错误')
					res.send({
						status: 0,
						type: 'ERROR_PASSWORD',
						message: '密码错误',
					})
					return 
				}else{
					// user—_id 是用来判断用户是否登录的
					req.session.user_id = user.user_id;
					const userinfo = await UserInfoModel.findOne({user_id: user.user_id}, '-_id');
					res.send(userinfo) 

				}
			}catch(err){
				console.log('用户登陆失败', err);
				res.send({
					status: 0,
					type: 'SAVE_USER_FAILED',
					message: '登陆失败',
				})
			}
		})
	}

	// 通过用户 id 和 session 来获取用户的个人信息
	async getInfo(req, res, next){
		const sid = req.session.user_id;
		const qid = req.query.user_id;
		const user_id = sid || qid;
		if (!user_id || !Number(user_id)) {
			console.log('获取用户信息的参数user_id无效', user_id)
			res.send({
				status: 0,
				type: 'GET_USER_INFO_FAIELD',
				message: '通过session获取用户信息失败',
			})
			return 
		}
		try{
			const userinfo = await UserInfoModel.findOne({user_id}, '-_id');
			res.send(userinfo) 
		}catch(err){
			console.log('通过session获取用户信息失败', err);
			res.send({
				status: 0,
				type: 'GET_USER_INFO_FAIELD',
				message: '通过session获取用户信息失败',
			})
		}
	}
	// 通过用户 id 来获取用户的个人信息
	async getInfoById(req, res, next){
		const user_id = req.params.user_id;
		if (!user_id || !Number(user_id)) {
			console.log('通过ID获取用户信息失败')
			res.send({
				status: 0,
				type: 'GET_USER_INFO_FAIELD',
				message: '通过用户ID获取用户信息失败',
			})
			return 
		}
		try{
			const userinfo = await UserInfoModel.findOne({user_id}, '-_id');
			res.send(userinfo) 
		}catch(err){
			console.log('通过用户ID获取用户信息失败', err);
			res.send({
				status: 0,
				type: 'GET_USER_INFO_FAIELD',
				message: '通过用户ID获取用户信息失败',
			})
		}
	}
	// 登出 因为客户端是通过 cookie 来判断登录态的 所以直接删掉就可以
	async signout(req, res, next){
		delete req.session.user_id;
		res.send({
			status: 1,
			message: '退出成功'
		})
	}
	// 修改密码 
	async chanegPassword(req, res, next){
		const cap = req.cookies.cap;
		if (!cap) {
			console.log('验证码失效')
			res.send({
				status: 0,
				type: 'ERROR_CAPTCHA',
				message: '验证码失效',
			})
			return
		}
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			const {username, oldpassWord, newpassword, confirmpassword, captcha_code} = fields;
			try{
				if (!username) {
					throw new Error('用户名参数错误');
				}else if(!oldpassWord){
					throw new Error('必须添加旧密码');
				}else if(!newpassword){
					throw new Error('必须填写新密码');
				}else if(!confirmpassword){
					throw new Error('必须填写确认密码');
				}else if(newpassword !== confirmpassword){
					throw new Error('两次密码不一致');
				}else if(!captcha_code){
					throw new Error('请填写验证码');
				}
			}catch(err){
				console.log('修改密码参数错误', err);
				res.send({
					status: 0,
					type: 'ERROR_QUERY',
					message: err.message,
				})
				return
			}
			if (cap.toString() !== captcha_code.toString()) {
				res.send({
					status: 0,
					type: 'ERROR_CAPTCHA',
					message: '验证码不正确',
				})
				return
			}
			// 到时候打印下编码的流程  看看是怎么解码的
			const md5password = this.encryption(oldpassWord);
			try{
				const user = await UserModel.findOne({username});
				if (!user) {
					res.send({
						status: 0,
						type: 'USER_NOT_FOUND',
						message: '未找到当前用户',
					})
				}else if(user.password.toString() !== md5password.toString()){
					res.send({
						status: 0,
						type: 'ERROR_PASSWORD',
						message: '密码不正确',
					})
				}else{
					user.password = this.encryption(newpassword);
					user.save();
					res.send({
						status: 1,
						success: '密码修改成功',
					})
				}
			}catch(err){
				console.log('修改密码失败', err);
				res.send({
					status: 0,
					type: 'ERROR_CHANGE_PASSWORD',
					message: '修改密码失败',
				})
			}
		})
	}
	// 下面是两个编码的格式 
	encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	}
	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	}
	// 获取用户列表 这个是在管理系统里面使用的 而且是带分页的
	async getUserList(req, res, next){
		const {limit = 20, offset = 0} = req.query;
		try{
			const users = await UserInfoModel.find({}, '-_id').sort({user_id: -1})
							.limit(Number(limit)).skip(Number(offset));
			res.send(users);
		}catch(err){
			console.log('获取用户列表数据失败', err);
			res.send({
				status: 0,
				type: 'GET_DATA_ERROR',
				message: '获取用户列表数据失败'
			})
		}
	}
	// 获取用户数量
	async getUserCount(req, res, next){
		try{
			const count = await UserInfoModel.count();
			res.send({
				status: 1,
				count,
			})
		}catch(err){
			console.log('获取用户数量失败', err);
			res.send({
				status: 0,
				type: 'ERROR_TO_GET_USER_COUNT',
				message: '获取用户数量失败'
			})
		}
	}
	// 更新个人头像
	async updateAvatar(req, res, next){
		const sid = req.session.user_id;
		const pid = req.params.user_id;
		const user_id = sid || pid;
		if (!user_id || !Number(user_id)) {
			console.log('更新头像，user_id错误', user_id)
			res.send({
				status: 0,
				type: 'ERROR_USERID',
				message: 'user_id参数错误',
			})
			return 
		}

		try{
			const image_path = await this.getPath(req);
			await UserInfoModel.findOneAndUpdate({user_id}, {$set: {avatar: image_path}});
			res.send({
				status: 1,
				image_path,
			})
		}catch(err){
			console.log('上传图片失败', err);
			res.send({
				status: 0,
				type: 'ERROR_UPLOAD_IMG',
				message: '上传图片失败'
			})
		}
	}

	// 上传个人评价图片
	async uploadAssessImg(req, res, next){
		try{
			const image_path = await this.getPath(req);
			res.send({
				status: 1,
				image_path,
			})
		}catch(err){
			console.log('上传图片失败', err);
			res.send({
				status: 0,
				type: 'ERROR_UPLOAD_IMG',
				message: '上传图片失败???'
			})
		}
	}

	// 上传个人评价
	async uploadAssess(req, res, next){
		const form = new formidable.IncomingForm();
		const sid = req.session.user_name;
		const pid = req.params.user_name;
		const user_name = sid || pid;
		form.parse(req, async (err, fields, files) => {
			const {username, usericon, shopid, orderinfo, star, imgArr, text} = fields;
			console.log(username, usericon, shopid, orderinfo, star, imgArr, text);
			try{
				let rating = await RatingModel.findOne({restaurant_id: shopid});
				let foodImg = [];
				let tempArr = JSON.parse(imgArr);
				for (var i = tempArr.length - 1; i >= 0; i--) {
					foodImg.push({
				        "food_id": '',
				        "food_name": "",
				        "image_hash": tempArr[i],
				        "is_valid": 1
				    });
				}
				let info = {
				    "avatar": usericon,
				    "highlights": [],
				    "item_ratings": foodImg,
				    "rated_at": dtime().format('YYYY-MM-DD HH:mm'),
				    "rating_star": star,
				    "rating_text": text,
				    "tags": [],
				    "time_spent_desc": orderinfo,
				    "username": username
				};
				rating.ratings.push(info);
				// 处理店铺总分
				let allSore = 0;
				rating.ratings.forEach((val,ind)=>{
					allSore += val.rating_star;
				})
				rating.scores = {
				    "compare_rating": 0,
				    "deliver_time": 40,
				    "food_score": allSore,
				    "order_rating_amount": 0,
				    "overall_score": allSore/rating.ratings.length,
				    "service_score": 0
				};
				// 处理标签
				rating.tags[(+star)-1].count += 1;
				rating.save();
				if (!rating) {
					res.send({
						status: 0,
						type: 'rating_NOT_FOUND',
						message: '未找到当前丁璞',
					})
				}else{
					res.send({
						status: 1,
						success: '评价成功',
					})
				}
			}catch(err){
				console.log('评价失败', err);
				res.send({
					status: 0,
					type: 'ERROR_CHANGE_PASSWORD',
					message: '评价失败',
				})
			}
		})
	}
		// 更新个人信息
	async updateInfo(req, res, next){
		const sid = req.session.user_id;
		const pid = req.params.user_id;
		const setKey = req.query.key;
		const setVal = req.query.val;
		const user_id = sid || pid;
		if (!user_id || !Number(user_id)) {
			console.log('更新个人信息，user_id错误', user_id)
			res.send({
				status: 0,
				type: 'ERROR_USERID',
				message: 'user_id参数错误',
			})
			return 
		}
		try{
			let userInfo = await UserInfoModel.findOne({user_id});
			userInfo[setKey] = setVal;
			userInfo.save();
			res.send({
				status: 1,
				message: 'success',
			})
		}catch(err){
			console.log('失败', err);
			res.send({
				status: 0,
				type: 'ERROR_UPLOAD_IMG',
				message: '失败'
			})
		}
	}
	// 获取用户的城市  对北上广深其他的用户进行分类
	async getUserCity(req, res, next){
		const cityArr = ['北京', '上海', '深圳', '杭州'];
		const filterArr = [];
		cityArr.forEach(item => {
			filterArr.push(UserInfoModel.find({city: item}).count())
		})

		filterArr.push(UserInfoModel.$where('!"北京上海深圳杭州".includes(this.city)').count())

		Promise.all(filterArr).then(result => {
			res.send({
				status: 1,
				user_city: {
					beijing: result[0],
					shanghai: result[1],
					shenzhen: result[2],
					hangzhou: result[3],
					qita: result[4],
				}
			})
		}).catch(err => {
			console.log('获取用户分布城市数据失败', err);
			res.send({
				status: 0,
				type: 'ERROR_GET_USER_CITY',
				message: '获取用户分布城市数据失败'
			})
		})
	}
} 

export default new User()