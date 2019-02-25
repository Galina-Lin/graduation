 <template>
  <div class="page">
        <head-top head-title="我的余额" go-back='true'></head-top>
        <section class="content_container">
            <section class="content">
                <header class="content_header">
                    <span class="content_title_style">当前余额</span>
                    <section class="contetn_description">
                        <img src="../../images/description.png" height="24" width="24">
                        <!-- <router-link to="/balance/detail" class="content_title_style">余额说明</router-link> -->
                    </section>
                </header>
                <p class="content_num">
                    <span>{{parseInt(userInfo.balance).toFixed(2)}}</span>
                    <span>元</span>
                </p>
                <div class="promit_button" @click="recharge">充值</div>
            </section>
        </section>
        <div class="recharge" v-if="showRecharge">
          <div class="recharge-title">支付宝充值</div>
          <input  class="recharge-input" placeholder="请输入支付宝账号" require>
          <input type="password" class="recharge-input" placeholder="请输入支付宝密码" require>
          <input type="number" class="recharge-input" placeholder="请输入充值金额" require v-model="balance">
          <br>
          <button class="recharge-confirm"  @click="comfirmRecharge">确认</button>
        </div>
        <!-- <p class="deal_detail">交易明细</p>
        <div class="no_log">
            <img src="../../images/no-log.png">
            <p>暂无明细记录</p>
        </div> -->
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from 'src/components/common/alertTip'
    import {recharge} from 'src/service/getData'
    import {mapState, mapMutations} from 'vuex'

    export default {
      data(){
            return{
                showAlert: false,
                alertText: null,
                showRecharge: false,
            }
        },
        mounted(){

        },
        components: {
            headTop,
            alertTip,
        },
        computed: {
            ...mapState([
                'userInfo',
            ]),
        },
        methods: {
          recharge() {
            this.showRecharge = true;
          },
          comfirmRecharge(){
            this.updateBalance();
          },
          async updateBalance(){
              if (this.userInfo && this.balance) {
                this.hongbaoList = await recharge(this.userInfo.user_id, this.userInfo.balance + (+this.balance));
                this.showRecharge = false;
                this.$store.dispatch('getUserInfo');
              }
          }
        },
        beforeRouteEnter(to, from, next){
          console.log('uuuuuupdate');
          next();
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .page{
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .content_container{
        padding: .3rem;
        background-color: $blue;
        .content{
            padding: .4rem;
            background-color: #fff;
            border-radius: .15rem;
            .content_header{
                @include fj;
                font-size: .55rem;
                .contetn_description{
                    display: flex;
                    align-items: center;
                    img{
                        @include wh(.6rem, .6rem);
                        margin-right: .2rem;
                    }
                    .content_title_style{
                        color: $blue;
                    }
                }
                .content_title_style{
                    color: #666;
                }
            }
            .content_num{
                span:nth-of-type(1){
                    @include sc(1.8rem, #333);
                }
                span:nth-of-type(2){
                    @include sc(.7rem, #333);
                }
            }
            .promit_button{
                @include wh(100%, 2rem);
                @include sc(.8rem, #fff);
                border-radius: 0.15rem;
                line-height: 2rem;
                margin-top: 1rem;
                text-align: center;
                background-color: #3190e8;
                cursor: pointer;
            }
        }
    }
    .deal_detail{
        @include sc(.6rem, #999);
        line-height: 2rem;
        padding-left: .5rem;
    }
    .no_log{
        text-align: center;
        margin-top: 1rem;
        img{
            @include wh(8rem, 5rem);
        }
        p{
            margin-top: .5rem;
            @include sc(.7rem, #666);
        }
    }
    .recharge{
      position: fixed;
      top: 250px;
      left: 41%;
      border: 1px solid #ccc;
      padding: 10px;
      padding-top: 0;
      width: 350px;
      box-sizing: border-box;
      &-title{
        background: $blue;
        color: #fff;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        width: 350px;
        margin-left: -10px;
        text-align: center;
        margin-bottom: 10px;
      }
      &-input{
        background: #fff;
        width: 100%;
        height: 25px;
      }
      &-confirm{
        background: $blue;
        border:0;
        outline:0;
        width: 100%;
        color: #fff;
        height:30px;
        margin-top: 10px;
      }
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
