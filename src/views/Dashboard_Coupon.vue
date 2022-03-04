<template>
  <div class="text-end mt-4 me-5">
    <button
      class="btn btn-primary"
      type="button"
      @click="openCouponModal(true)"
    >
      建立新的優惠券
    </button>
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>名稱</th>
        <th>折扣百分比</th>
        <th>到期日</th>
        <th>是否啟用</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, key) in coupons" :key="key">
        <td>{{ item.title }}</td>
        <td>{{ item.percent }}%</td>
        <td>{{ filter(item.due_date) }}</td>
        <td>
          <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
          <span v-else class="text-muted">未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button
              class="btn btn-outline-primary btn-sm"
              @click="openCouponModal(false, item)" :disabled="item.id === loading_item.edit"
            >
              編輯
                <div class="spinner-border spinner-border-sm" role="status"
                      v-show="item.id === loading_item.edit">
                </div>
            </button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="openDelCouponModal(item)" :disabled="item.id === loading_item.delete"
            >
              刪除
                <div class="spinner-border spinner-border-sm" role="status"
                      v-show="item.id === loading_item.delete">
                </div>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <couponPagination :coupon_pagination="coupon_pagination" @get_order="getCoupon"></couponPagination>
  <loading></loading>
  <couponModal></couponModal>
  <couponDelModal></couponDelModal>
</template>

<script>
import emitter from '@/utils/emitter.js'
import couponModal from '../components/CouponModal.vue'
import couponDelModal from '../components/Coupon_Del_Modal.vue'
import couponPagination from '../components/CouponPagination.vue'
import loading from '../components/Loading_Window.vue'
export default {
  components: {
    loading,
    couponModal,
    couponDelModal,
    couponPagination
  },
  data () {
    return {
      coupons: [],
      coupon_pagination: [],
      loading_item: {} //* 用來做 disabled 和 加載效果 判斷
    }
  },
  methods: {
    //* 登入驗證
    checkLogin () {
      const api = `${process.env.VUE_APP_API}/api/user/check`
      this.$http.post(api)
        .catch(() => {
          this.$router.push('/login')
        })
    },
    //* 開啟新增、編輯優惠券 modal
    openCouponModal (status, item) {
      if (status) {
        emitter.emit('updateCoupon')
      } else if (!status) {
        this.loading('edit', item.id)
        const temp = JSON.parse(JSON.stringify(item)) //* 深拷貝
        emitter.emit('updateCoupon', temp)
      }
    },
    //* 開啟刪除優惠券 modal
    openDelCouponModal (item) {
      this.loading('delete', item.id)
      emitter.emit('openDelCoupon_Modal', item)
    },
    //* 取得優惠券
    getCoupon (page) {
      emitter.emit('load', 500)
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`
      this.$http
        .get(api)
        .then((res) => {
          this.coupons = res.data.coupons
          this.coupon_pagination = res.data.pagination
        })
        .catch(() => {
          this.$router.push('/login')
        })
    },
    //* 日期轉換
    filter (time) {
      return new Date(time * 1000).toISOString().substring(0, 10)
    },
    //* 單個物件_加載效果
    loading (control, id) {
      this.loading_item[control] = id
      setTimeout(() => {
        this.loading_item = {}
      }, 1000)
    }
  },
  mounted () {
    //* 將儲存在 cookie 的 token 取出
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)mizuToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    this.$http.defaults.headers.common.Authorization = token
    this.getCoupon()
    emitter.on('get_coupon', () => {
      this.getCoupon()
    })
    this.checkLogin()
  }
}
</script>
