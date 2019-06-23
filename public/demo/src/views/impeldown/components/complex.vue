<template>
  <div class="impel-complex">
    <div>
      <img class="example-img" :src="load_url" alt="">
    </div>
    <div class="progress">
      <a-progress :percent="schedule" status="success"/>
    </div>
    <a-button class="btn-download" type="danger" icon="download" size="large" :loading="loading" :disabled="disabled" @click.native="download">下载</a-button>
  </div>
</template>
<script>
import impeldown from 'impeldown'
const url = require('../../../assets/img/girl.gif')
export default {
  data () {
    return {
      // load_url: 'https://hbimg.huabanimg.com/a97ad9c6f011751440da97ad66ba9b50ee0b31702bbfe8-PSh4ga_fw658',
      load_url: url,
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
        name: '美女.gif',
        onStart () {
          _this.loading = true
        },
        onProgress (p) {
          _this.schedule = Number((p * 100).toFixed(2))
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
