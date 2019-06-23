<template>
 <div id="impeldownPage" class="common-page">
   <a-alert class="alert" :message="remind" type="error"/>
   <a-card class="panel" title="示例一：简单应用">
     <div class="code-box-demo">
       <simple></simple>
     </div>
     <div class="code-box-meta">
       <h4>小文件 53KB</h4>
       <p>因为文件较小，所以这种情况下可能不需要监控进度，直接下载就好了</p>
       <a-tooltip placement="top" >
        <template slot="title">
          <span>show code</span>
        </template>
        <a-icon class="code-expand-icon" type="code" @click="code1Flag=!code1Flag"/>
      </a-tooltip>
     </div>
     <div class="highlight-wrapper" v-show="code1Flag">
       <pre>
         <code>
           {{code1Text}}
        </code>
       </pre>
     </div>
   </a-card>
   <a-card class="panel" title="示例二：完整应用">
     <div class="code-box-demo">
       <complex></complex>
     </div>
     <div class="code-box-meta">
       <h4>中型文件 2.9MB</h4>
       <p>可以清晰的看到进度条的变化</p>
       <a-tooltip placement="top" >
        <template slot="title">
          <span>show code</span>
        </template>
        <a-icon class="code-expand-icon" type="code" @click="code2Flag=!code2Flag"/>
      </a-tooltip>
     </div>
     <div class="highlight-wrapper" v-show="code2Flag">
       <pre>
         <code>
           {{code2Text}}
        </code>
       </pre>
     </div>
   </a-card>
 </div>
</template>
<script>
import simple from './components/simple'
import complex from './components/complex'
import hljs from 'highlight.js'
export default {
  data () {
    return {
      remind: '本示例采用ant-design-vue UI框架，示例中所用到的下载url为个人站点资源，如有侵权，请联系告知',
      code1Text: '',
      code2Text: '',
      code1Flag: false,
      code2Flag: false,
      script: '<script>'
    }
  },
  components: {
    simple,
    complex
  },
  created () {
    this.init()
  },
  mounted () {
    this.high()
  },
  methods: {
    init () {
      this.code1Text = `
         <template>
          <div class="impel-simple">
            <div>
              <img class="example-img" :src="load_url" alt="">
            </div>
            <a-button class="btn-download" type="danger" icon="download"
            size="large" @click.native="download">下载</a-button>
          </div>
        </template>
        ${this.script}
        import impeldown from 'impeldown'
        export default {
          data () {
            return {
              load_url: '下载url'
            }
          },
          methods: {
            download () {
              new impeldown(this.load_url)
            }
          }
        }
        ${this.script}
      `
      this.code2Text = `
         <template>
          <div class="impel-complex">
            <div>
              <img class="example-img" :src="load_url" alt="">
            </div>
            <div class="progress">
              <a-progress :percent="schedule" status="success"/>
            </div>
            <a-button class="btn-download" type="danger" icon="download"
            size="large" :loading="loading" :disabled="disabled"
            @click.native="download">下载</a-button>
          </div>
        </template>
        ${this.script}
        import impeldown from 'impeldown'
        export default {
        data () {
          return {
            load_url: '下载url',
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
      ${this.script}
      `
    },
    high () {
      hljs.initHighlightingOnLoad();
    }
  }
}
</script>
<style scoped>
#impeldownPage {
  padding: 20px;
}
.alert {
  margin-top: 30px;
}
p {
  margin-bottom: 0;
}
.panel {
  margin-top: 30px;
}
.code-box-demo {
  padding: 20px;
}
.code-box-meta {
  position: relative;
  padding: 18px 32px;
  border-radius: 0 0 2px 2px;
  transition: background-color 0.4s;
  width: 100%;
  font-size: 14px;
  border-top: 1px solid #ebedf0;
}
.code-box-meta > h4 {
  position: absolute;
  top: -14px;
  padding: 1px 8px;
  margin-left: -8px;
  color: #777;
  border-radius: 2px 2px 0 0;
  background: #fff;
  font-size: 14px;
  width: auto;
}
.code-expand-icon {
  position: absolute;
  right: 16px;
  bottom: 23px;
  cursor: pointer;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  font-size: 18px;
}
.highlight-wrapper {
  border-top: 1px dashed #ebedf0;
}
</style>
