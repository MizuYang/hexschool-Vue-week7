<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/home">小巷弄早午餐</router-link>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/product" class="nav-link active"
              >產品</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/order" class="nav-link active">訂單</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/coupon" class="nav-link active"
              >優惠券</router-link
            >
          </li>
          <li class="nav-item">
            <button
              type="button"
              to="/login"
              class="nav-link active btn"
              @click="logOut"
            >
              登出
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view></router-view>
</template>

<script>
export default {
  methods: {
    //* 登入驗證
    checkLogin () {
      const api = `${process.env.VUE_APP_API}/api/user/check`
      this.$http.post(api)
        .then(() => {
          //* 確認登入後推送到產品頁
          this.$router.push('/product')
        })
        .catch(() => {
          this.$router.push('/login')
        })
    },
    //* 登出
    logOut () {
      const api = `${process.env.VUE_APP_API}/logout`
      this.$http
        .post(api)
        .then((res) => {
          alert(res.data.message)
          this.$router.push('/login')
        })
        .catch((err) => {
          alert(err.data.message)
        })
    }
  },
  mounted () {
    //* 將儲存在 cookie 的 token 取出
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)mizuToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    this.$http.defaults.headers.common.Authorization = token
    //* 檢查登入狀態
    this.checkLogin()
  }
}
</script>
