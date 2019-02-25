'use strict';

/* 数据统计 */

import mongoose from 'mongoose'

const Schema  = mongoose.Schema;

const statisSchema = new Schema({
	date: String,
	origin: String,
	id: Number,
})

statisSchema.index({id: 1})

const Statis = mongoose.model('Statis', statisSchema)

export default Statis