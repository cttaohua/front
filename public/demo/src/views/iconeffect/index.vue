<template>
  <div id="iconeffectPage">
    <h2 class="title">立体特效</h2>
    <p class="display effect01">
      <i class="iconfont icon-bqklt"></i>
      <span>iconfont我来了</span>
    </p>
    <div class="codeArea">
      <codeArea :codeText="codeText1"></codeArea>
    </div>
    <h2 class="title">长尾特效</h2>
    <p class="display effect02">
      <i class="iconfont icon-bqklt"></i>
      <span>iconfont我来了</span>
    </p>
    <div class="codeArea">
      <codeArea :codeText="codeText2"></codeArea>
    </div>
    <h2 class="title">凹凸特效</h2>
    <p class="display effect03">
      <i class="iconfont icon-bqklt"></i>
      <span>iconfont我来了</span>
    </p>
    <div class="codeArea">
      <codeArea :codeText="codeText3"></codeArea>
    </div>
    <h2 class="title">网格特效</h2>
    <p class="display effect04">
      <i class="iconfont icon-bqklt"></i>
      <span>iconfont我来了</span>
    </p>
    <div class="codeArea">
      <codeArea :codeText="codeText4"></codeArea>
    </div>
    <h2 class="title">星空特效</h2>
    <p class="display effect05">
      <i class="iconfont icon-bqklt"></i>
      <span>iconfont我来了</span>
    </p>
    <div class="codeArea">
      <codeArea :codeText="codeText5"></codeArea>
    </div>
    <h2 class="title">反星空特效</h2>
    <p class="display effect06">
      <i class="iconfont icon-bqklt"></i>
      <span>iconfont我来了</span>
    </p>
    <div class="codeArea">
      <codeArea :codeText="codeText6"></codeArea>
    </div>
    <h2 class="title">火焰特效</h2>
    <p class="display effect07">
      <i class="iconfont icon-bqklt"></i>
      <span>iconfont我来了</span>
    </p>
    <div class="codeArea">
      <codeArea :codeText="codeText7"></codeArea>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    codeText1 () {
      return `
        .effect01 {
          background-color: #333;
          color:#fefefe;
          text-shadow:
          1px 1px 1px #c0c0c0,
          2px 2px 1px #b0b0b0,
          3px 3px 1px #a0a0a0,
          4px 4px 1px #909090;
        }
      `
    },
    codeText2 () {
      return `
        .effect02 {
          color: #333;
          background-color: #ddd;
          text-shadow:
            1px -1px 0 #767676,
            -1px 2px 1px #737272,
            -2px 4px 1px #767474,
            -3px 6px 1px #787777,
            -4px 8px 1px #7b7a7a,
            -5px 10px 1px #7f7d7d,
            -6px 12px 1px #828181,
            -7px 14px 1px #868585,
            -8px 16px 1px #8b8a89,
            -9px 18px 1px #8f8e8d,
            -10px 20px 1px #949392,
            -11px 22px 1px #999897,
            -12px 24px 1px #9e9c9c,
            -13px 26px 1px #a3a1a1,
            -14px 28px 1px #a8a6a6,
            -15px 30px 1px #adabab,
            -16px 32px 1px #b2b1b0,
            -17px 34px 1px #b7b6b5,
            -18px 36px 1px #bcbbba,
            -19px 38px 1px #c1bfbf,
            -20px 40px 1px #c6c4c4,
            -21px 42px 1px #cbc9c8,
            -22px 44px 1px #cfcdcd;
        }
      `
    },
    codeText3 () {
      return `
        .effect03 {
          color: #202020;
          background-color: #2d2d2d;
          text-shadow:
            -2px -2px 1px #111111,
            2px 2px 1px #363636;
        }
      `
    },
    codeText4 () {
      return `
        .effect04 {
          background-color: #333;
          background-image:
              linear-gradient(
                45deg,
                transparent 45%,
                hsla(48,20%,90%,1) 45%,
                hsla(48,20%,90%,1) 55%,
                transparent 0
                );
          background-size: .05em .05em;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 2px #111;
        }
      `
    },
    codeText5 () {
      return `
        .effect05 {
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 2px #d6d6d6;
          background: url('https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1614732232,705397304&fm=26&gp=0.jpg');
          background-size: cover;
        }
      `
    },
    codeText6 () {
      return `
        .effect06 {
          background: url('https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1614732232,705397304&fm=26&gp=0.jpg');
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: cover;
          animation: 10s infinite linear animate;
        }
        .effect06:before {
          content:"";
          width:100%;
          height:100%;
          position: absolute;
          left:0;
          top:0;
          background-color: #999;
          z-index: -1;
        }
        @keyframes animate {
          0% {
              background-position:0;
          }
          100% {
              background-position:-1000px 0;
          }
        }
      `
    },
    codeText7 () {
      return `
        .effect07 {
          background-color: black;
          color: white;
          text-shadow:
            0 0 20px #fefcc9,
            10px -10px 30px #feec85,
            -20px -20px 40px #ffae34,
            20px -40px 50px #ec760c,
            -20px -60px 60px #cd4606,
            0 -80px 70px #973716,
            10px -90px 80px #451b0e;
        }
      `
    }
  },
  created () {
    document.title = '图标字体特效'
  }
}
</script>
<style scoped>
@import '../../assets/font/iconfont.css';
@import '../../assets/css/effect.css';
#iconeffectPage {
  width: 100%;
}
.title {
  margin-bottom: 0;
  margin-top: 50px;
  text-align: center;
  font-size: 60px;
  font-weight: 700;
}
.display {
  font-size: 100px;
  font-weight: 700;
  line-height: 200px;
  text-transform: uppercase;
  position: relative;
  text-align: center;
  margin-bottom: 0;
}
.display span {
  margin-left: 10px;
}
.codeArea {
  border: 1px solid #e8e8e8;
  max-width: 750px;
  margin: 20px auto;
}
</style>
