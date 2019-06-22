<template>
  <div class="impel-simple">
    <div>
      <img class="example-img" :src="load_url" alt="">
    </div>
    <div class="progress">
      <a-progress :percent="schedule" />
    </div>
    <a-button class="btn-download" type="danger" icon="download" size="large" :loading="loading" :disabled="disabled" @click.native="download">下载</a-button>
  </div>
</template>
<script>
import impeldown from 'impeldown'
export default {
  data () {
    return {
      load_url: 'https://hbimg.huabanimg.com/51c1ca18c17da0ebc45a1e619c2137a1a0dc89632d202-cgTNdl_fw658',
      schedule: 0,
      loading: false,
      disabled: false
    }
  },
  methods: {
    download () {
      let _this = this
      new impeldown({
        url: this.load_url,
        name: '美女.jpg',
        onStart () {
          _this.loading = true
        },
        onProgress (p) {
          _this.schedule = p * 100
        },
        onSuccess () {
          _this.$message.success('下载完成')
        },
        onComplete () {
          _this.loading = false
          _this.disabled = true
        }
      })
    }
  }
}
</script>
<style scoped>
.example-img {
  max-width: 60%;
  display: block;
  margin: 0 auto;
}
.progress {
  width: 70%;
  margin: 20px auto 0;
}
.btn-download {
  width: 60%;
  display: block;
  margin: 20px auto 0;
}
</style>
