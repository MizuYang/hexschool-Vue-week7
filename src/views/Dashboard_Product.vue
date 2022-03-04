<template>
  <div class="container">
    <div class="text-center my-3">
      <h2>產品列表</h2>
    </div>
    <div class="text-end my-3">
      <button
        type="button"
        class="btn btn-primary"
        @click="open_Modal('new', product)"
      >
        新增產品
      </button>
    </div>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
      <div class="col" v-for="product in products" :key="product.id">
        <div class="card h-100" style="width: 19rem">
          <img
            :src="product.imageUrl"
            style="object-fit: cover; width: 250px; height: 250px"
            class="card-img-top img-fluid img-thumbnail mx-auto"
            alt="..."
          />
          <div class="card-body">
            <div class="mb-3">
              <h5 class="card-title">{{ product.title }}</h5>
              <p class="card-text">
                {{ product.description }}
              </p>
            </div>
          </div>
          <div class="card-footer justify-content-between d-flex">
            <strong v-if="product.is_enabled === 1" class="text-success fs-5">已啟用</strong>
            <del v-else class="text-muted">未啟用</del>
            <div class="ms-auto me-1">
              <button
                class="btn btn-secondary"
                @click="open_Modal('edit', product)"
                :disabled="product.id === loading.edit"
              >
                編輯
              </button>
            </div>
            <div>
              <button
                type="button"
                class="btn btn-danger"
                @click="removeProduct(product)"
                :disabled="product.id === loading.remove"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- load。ing -->
  <loading></loading>
  <!-- 新增、編輯、刪除 modal -->
  <productModal></productModal>
  <DelProductModal></DelProductModal>
</template>

<script>
import loading from '@/components/Loading_Window.vue'
import emitter from '@/utils/emitter.js'
import productModal from '../components/Product_Modal.vue'
import DelProductModal from '../components/Del_Product_Modal.vue'

export default {
  components: {
    productModal,
    DelProductModal,
    loading
  },
  data () {
    return {
      products: [],
      modal_status: {
        isNew: false,
        tempProduct: {
          imagesUrl: []
        }
      },
      loading: {
        remove: '',
        edit: ''
      }
    }
  },
  methods: {
    //* 登入驗證
    checkLogin () {
      const api = `${process.env.VUE_APP_API}/api/user/check`
      this.$http.post(api)
        .then(() => {
          //* 確認登入後推送到產品頁
          this.$router.push('/product')
          // this.$router.back()
        })
        .catch(() => {
          this.$router.push('/login')
        })
    },
    //* 取得產品
    get_products () {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products/all`
      this.$http
        .get(url)
        .then((res) => {
          this.products = res.data.products
        })
        .catch(() => {
          this.$router.push('/login')
        })
    },
    //* modal
    open_Modal (control, product) {
      if (control === 'new') {
        this.modal_status.isNew = true
        this.loading_one('new', 123)
        emitter.emit('update_modal', this.modal_status)
      } else if (control === 'edit') {
        this.loading_one(product.id, 'edit')
        this.modal_status.isNew = false
        //* this.loading('edit', product.id)
        this.modal_status.tempProduct = JSON.parse(JSON.stringify(product)) //* 深拷貝
        //* 因為在新增時多圖不是必填的選項，所以在編輯時會遇到沒有多圖 imagesUrl 陣列，無法新增多圖的情況 ，
        //* 若要新增多圖可以在 openModal 先判斷有沒有 imagesUrl 陣列，如果不存在就新增一個空的 imagesUrl 陣列

        emitter.emit('update_modal', this.modal_status)
      }
      if (!this.modal_status.tempProduct.imagesUrl) {
        this.modal_status.tempProduct.imagesUrl = []
      }
    },
    //* 刪除產品
    removeProduct (product) {
      this.loading_one(product.id, 'remove')
      emitter.emit('emitter', product)
    },
    //* loading 單一物件
    loading_one (id, item) {
      this.loading[item] = id
      setTimeout(() => {
        this.loading[item] = ''
      }, 1000)
    }
  },
  created () {
    //* 將儲存在 cookie 的 token 取出
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)mizuToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    )
    this.$http.defaults.headers.common.Authorization = token
  },
  mounted () {
    this.get_products()
    emitter.on('get_product', () => {
      this.get_products()
    })
    this.checkLogin()
  }
}
</script>
