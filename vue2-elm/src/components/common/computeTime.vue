 <template>
    <div class="page">
        <span class="rem_time" style="color: orange;border-width: 1px;border-style: solid;border-color: orange;" @click="gotoPay">
	       {{remaining}}
        </span>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>  
    </div>
</template>

<script>
    import alertTip from 'src/components/common/alertTip'
    import {setOrderStatus} from 'src/service/getData'

    export default {
    	data(){
            return{
                countNum: 900,
                showAlert: false,
                alertText: null,
            }
        },
        mounted(){
            this.countNum -= this.numTime;
            this.remainingTime();
        },
        props: ['time', 'orderId', 'totalAmount'],
        components: {
            alertTip,
        },
        methods: {
            closeTip(){
                this.$emit('closeTip')
            },
            //计算时间
            remainingTime(){
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    this.countNum --;
                    if (this.countNum <= 0) {
                        clearInterval(this.timer);
                        this.showAlert = true;
                        this.alertText = '支付超时';
                        setOrderStatus(this.orderId, '支付超时');
                        setTimeout(()=>{
                            window.location.reload();
                        },1000)
                    }
                }, 1000);
            },
            gotoPay(){
                this.$router.push({path: '/confirmOrder/payment', query:{ orderId:this.orderId, time:this.countNum, total_amount:this.totalAmount}});
            }
        },
        computed: {
            //转换时间成分秒
            remaining: function (){
                let minute = parseInt(this.countNum/60);
                let second = parseInt(this.countNum%60);
                if (minute < 10) {
                    minute = '0' + minute;
                }
                if (second < 10) {
                    second = '0' + second;
                }
                return '去支付(还剩' + minute + '分' + second + '秒)';
            },
            //订单返回时间秒分分别处理
            numTime: function (){
                if (this.time.toString().indexOf('分钟') !== -1) {
                    return parseInt(this.time)*60;
                }else{
                    return parseInt(this.time);
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
	.page{
        display: inline-block;
        .rem_time{
            @include sc(.55rem, #orange);
            padding: .1rem .2rem;
            border-radius: .15rem;
        }
    }
</style>
