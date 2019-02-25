 <template>
  <div class="download_page">
        <button @click="submit" class="submit" style="cursor:pointer">提交</button>
        <head-top head-title="评价" go-back='true'></head-top>
        <section class="dowload_container">
            <div class="star">
                <label><input type="radio" name="star" v-model="star" value="1">一星</label>
                <label><input type="radio" name="star" v-model="star" value="2">二星</label>
                <label><input type="radio" name="star" v-model="star" value="3">三星</label>
                <label><input type="radio" name="star" v-model="star" value="4">四星</label>
                <label><input type="radio" name="star" v-model="star" value="5">五星</label>
            </div>
            <div class="img">
                <input type="file" class="profileinfopanel-upload" @change="uploadAvatar(1)" id="profileinfopanel-upload1">
                <img :src="imgBaseUrl+uploadImg1" alt="op">
            </div>
            <div class="img">
                <input type="file" class="profileinfopanel-upload" @change="uploadAvatar(2)" id="profileinfopanel-upload2">
                <img :src="imgBaseUrl+uploadImg2" alt="op">
            </div>
            <div class="img">
                <input type="file" class="profileinfopanel-upload" @change="uploadAvatar(3)" id="profileinfopanel-upload3">
                <img :src="imgBaseUrl+uploadImg3" alt="op">
            </div>
            <br>
            <textarea rows="20" cols="50" class="textarea" v-model="text"></textarea>
        </section>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText">评价成功</alert-tip>
    </div>
</template>

<script>
    import {mapMutations, mapState} from 'vuex'
    import headTop from 'src/components/header/head'
    import {signout} from 'src/service/getData'
    import alertTip from 'src/components/common/alertTip'
    import {getImgPath} from 'src/components/common/mixin'
    import {imgBaseUrl} from 'src/config/env'
    import {removeStore} from 'src/config/mUtils'
    import {uploadAssess} from 'src/service/getData'

    export default {
        data(){
            return{
                showAlert:false,
                text:'',
                star:'', 
                imgArr:'',     //用户手机
                orderinfo:'',      //用户头像
                show:false,     //显示提示框
                shopid:true,  //是否登录
                uploadImg1: 'addImg.png',
                uploadImg2: 'addImg.png',
                uploadImg3: 'addImg.png',
                imgBaseUrl,
            }
        },
        beforeDestroy(){
            clearTimeout(this.timer)
        },
        components: {
            headTop,
            alertTip,
        },
        mixins: [getImgPath],
        computed:{
            ...mapState([
                'userInfo', 'imgPath'
            ]),
        },
        created() {
            console.log(this.$route.query);
            console.log(this.$route.query.orderInfo);
            console.log(this.$route.query.id);
            const info = JSON.parse(this.$route.query.orderInfo);
            let item = '';
            info[0].forEach((val,ind)=>{
                item += (val.name + ' , ');
            })
            console.log(item);
            this.orderinfo = item;
            this.shopid = this.$route.query.id;
            this.orderId = this.$route.query.orderId;
            localStorage[`order${this.orderId}`] = 1;
        },
        methods: {
            async submit(){
                // this.showAlert = true;
                // this.alertText = '请在手机APP中设置';
                if (this.userInfo) {
                    try{
                        let response = await uploadAssess(
                              this.userInfo.username,
                              this.userInfo.avatar,
                              this.shopid,
                              this.orderinfo,
                              this.star || 5,
                              this.fiter(),
                              this.text);
                        console.log(response);
                        this.showAlert = true;
                        setTimeout(()=>{
                            this.$router.push('/order');
                        },800)
                    }catch (error) {
                        this.showAlert = true;
                        this.alertText = '上传失败';
                        throw new Error(error);
                    }
                }
            },
            async uploadAvatar(ind){
                let input = document.querySelector('#profileinfopanel-upload'+ind)
                let data = new FormData();
                data.append('file', input.files[0]);
                try{
                    let response = await fetch('/eus/v1/users/uploadAssessImg', {
                          method: 'POST',
                          credentials: 'include',
                          body: data
                        })
                    let res = await response.json();
                    if (res.status == 1) {
                        if (ind == 1) {
                            this.uploadImg1 = res.image_path;
                        }else if (ind == 2) {
                            this.uploadImg2 = res.image_path;
                        }else if (ind == 3) {
                            this.uploadImg3 = res.image_path;
                        }
                    }
                    console.log(res);
                }catch (error) {
                    this.showAlert = true;
                    this.alertText = '上传失败';
                    throw new Error(error);
                }
            },
            fiter (){
                let arrs = [];
                if(!/addImg/i.test(this.uploadImg1)){
                    arrs.push(this.uploadImg1); 
                }
                if(!/addImg/i.test(this.uploadImg2)){
                    arrs.push(this.uploadImg2); 
                }
                if(!/addImg/i.test(this.uploadImg3)){
                    arrs.push(this.uploadImg3); 
                }
                return JSON.stringify(arrs);
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .download_page{
        position: absolute;
        top: 0;
        left: 10%;
        right: 0;
        bottom: 0;
        width: 80%;
        padding-left: 50px;
        background-color: #fff;
        z-index: 202;
        padding-top: 60px;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .submit{
        position: absolute;
        top: 110px;
        right: 90px;
        width: 130px;
        height: 50px;
        font-size: 20px;
        border-radius: 10px;
        color: #fff;
        background: #3190e8;
    }
    .dowload_container{
        text-align: left;
        .star{
            margin-left: 15px;
            label{
                margin-right: 15px;
                color: #aaa;
            }
        }
        .img{
            margin: 20px 0;
            position: relative;
            width: 100px;
            height: 100px;
            display: inline-block;
            img{
                width: 4rem;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
        .textarea{
            width: 96.5%;
            background: #eee;
            border-radius: 20px;
            padding: 10px 50px;
            font-size: 18px;
        }
    }

    .profileinfopanel-upload{
        display: block;
        position: absolute;
        opacity: 0;
        top: 0;
        left: 0;
        z-index: 999;
        @include wh(100%,100%);
    }
</style>
