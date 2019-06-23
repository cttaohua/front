<template>
  <div class="impel-simple">
    <div>
      <img class="example-img" :src="load_url" alt="">
    </div>
    <a-button class="btn-download" type="danger" icon="download" size="large" @click.native="download">下载</a-button>
  </div>
</template>
<script>
import impeldown from 'impeldown'
const url = require('../../../assets/img/hongfen.jpg')
export default {
  data () {
    return {
      // load_url: 'https://hbimg.huabanimg.com/51c1ca18c17da0ebc45a1e619c2137a1a0dc89632d202-cgTNdl_fw658'
      load_url: url
    }
  },
  methods: {
    download () {
      new impeldown(this.load_url)
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
.btn-download {
  width: 60%;
  display: block;
  margin: 20px auto 0;
}
</style>
