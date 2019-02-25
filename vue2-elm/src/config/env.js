/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = 'http://localhost:8001';
let routerMode = 'hash';
let imgBaseUrl;


if (process.env.NODE_ENV == 'development') {
    imgBaseUrl = 'http://localhost:8001/img/';

}else if(process.env.NODE_ENV == 'production'){
	// baseUrl = 'http://localhost:8001';
    imgBaseUrl = 'http://localhost:8001/img/';
}

export {
	baseUrl,
	routerMode,
	imgBaseUrl,
}
