<template>
  <div>後台首頁</div>
  <loading></loading>
</template>

<script>
import loading from '@/components/Loading_Window.vue'
export default {
  components: {
    loading
  },
  methods: {
    //* 檢查登入狀態
    checkLogin () {
      const url = `${process.env.VUE_APP_API}/api/user/check`
      this.$http
        .post(url)
        .then(() => {})
        .catch((err) => {
          this.$router.push('/login')
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
    this.checkLogin()
  }
}
</script>
