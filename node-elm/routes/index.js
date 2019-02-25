'use strict';

import v1 from './modules/v1'
import v2 from './modules/v2'
import v3 from './modules/v3'
import v4 from './modules/v4'
import ugc from './modules/ugc'
import bos from './modules/bos'
import eus from './modules/eus'
import admin from './modules/admin'
import statis from './modules/statis'
import member from './modules/member'
import shopping from './modules/shopping'
import promotion from './modules/promotion'

export default app => {
	// app.get('/', (req, res, next) => {
	// 	res.redirect('/');
	// });
	app.use('/v1', v1);
	app.use('/v2', v2);
	app.use('/v3', v3);
	app.use('/v4', v4);
	app.use('/ugc', ugc);
	app.use('/bos', bos);
	app.use('/eus', eus);
	app.use('/admin', admin);
	app.use('/member', member);
	app.use('/statis', statis);
	app.use('/shopping', shopping);
	app.use('/promotion', promotion);
}