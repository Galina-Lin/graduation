<template>
    <div class="fillcontain">
        <head-top></head-top>
        <header class="admin_title">管理员设置</header>
        <div class="admin_set">
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="用户名"><span>dsfsf</span></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">新增</el-button>
                    <el-button type="danger" @click="submitFormDel('loginForm')" class="submit_btn">删除</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {register, delAdmin } from '@/api/getData'
	import {mapActions, mapState} from 'vuex'

    export default {
    	components: {
    		headTop,
    	},
	    data(){
			return {
				loginForm: {
					username: '',
					password: '',
				},
				rules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
				},
				showLogin: false,
			}
		},
		mounted(){
			this.showLogin = true;
			if (!this.adminInfo.id) {
    			this.getAdminData()
    		}
		},
		computed: {
			...mapState(['adminInfo']),
		},
		methods: {
			...mapActions(['getAdminData']),
			async submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						const res = await register({user_name: this.loginForm.username, password: this.loginForm.password})
						if (res.status == 1) {
							this.$message({
		                        type: 'success',
		                        message: '新增成功'
		                    });
						}else{
							this.$message({
		                        type: 'error',
		                        message: '新增失败'
		                    });
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请输入用户名密码',
							offset: 100
						});
						return false;
					}
				});
            },
            async submitFormDel(formName) {
                console.log('del');
                if (this.loginForm.username) {
                    const res = await delAdmin(this.loginForm.username);
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: '删除失败'
                        });
                    }
                } else {
                    this.$notify.error({
                        title: '删除失败',
                        message: '请输入用户名',
                        offset: 100
                    });
                    return false;
                }
			},
		},
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.explain_text{
		margin-top: 20px;
		text-align: center;
		font-size: 20px;
		color: #333;
	}
    .admin_set{
        width: 60%;
        background-color: #F9FAFC;
        min-height: 400px;
        margin: 20px auto 0;
        border-radius: 10px;
        ul > li{
            padding: 20px;
            span{
                color: #666;
            }
        }
    }
    .admin_title{
        margin-top: 20px;
        .sc(24px, #666);
        text-align: center;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        margin-top: 10px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
