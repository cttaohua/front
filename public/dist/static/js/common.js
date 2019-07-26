/**
 * 工具类
 * 博哥2018.1.11----tob
 */
(function () {
  if (!window.WB) {
    window.WB = {}
  }
  WB = {
    //url参数获取
    getURLParameter: function(paramName) {
      var hashString = window.location.search.substring(1),
        i, val, params = hashString.split("&")
      for(i = 0; i < params.length; i++) {
        val = params[i].split("=")
        if(val[0] == paramName) {
          return decodeURIComponent(val[1])
        }
      }
      return null
    },
    //接口ajax
    myAjax: function(url, data, type, successfn, errorfn, completefn) {
      type = (type == null || type == "" || typeof(type) == "undefined") ? "post" : type
      data = (data == null || data == "" || typeof(data) == "undefined") ? "" : data
      var strToken = ""
      if(localStorage.getItem('WBtoken')) {
        strToken = localStorage.getItem('WBtoken')
      }
      if (type == "post") {
        data = JSON.stringify(data)
      }
      $('.loading').show()
      $.ajax({
        type: type,
        async: true,
        data: data,
        url: url,
        // crossDomain: true,
        contentType: 'application/json;charset=utf-8',
        // processData: false,
        // cache: false,
        dataType: 'json',
        xhrFields: {
          withCredentials: false
        },
        headers: {
          'Authorization': strToken
        },
        success: function(response) {
          $('.loading').hide()
          successfn(response)
        },
        error: function(response) {
          $('.loading').hide()
          errorfn(response.responseJSON)
          try {
            var data = JSON.parse(response.responseText)
            if(response.status === 422) {
              for(var error in data['errors']) {
                var message = data['errors'][error][0]
                break
              }
            } else {
              var message = data['message']
              if(response.status === 401) {
                console.log('认证失败')
                localStorage.removeItem('WBtoken')
                localStorage.removeItem('stuInfo')
                sessionStorage.removeItem('firstToken')
                sessionStorage.removeItem('stusInfo')
                window.location.href = "/"
              }
            }
          } catch(e) {
            console.log("error=" + e)
            $.warningModal({
              type: 'alert',
              content: '网络错误，请稍后重试',
              confirm: function() {}
            })
          }

        },
        complete: function(response) {

        }
      })
    },
    //分页ajax，没有loading
    pageAjax: function(url, data, type, successfn, errorfn, completefn) {
      type = (type == null || type == "" || typeof(type) == "undefined") ? "post" : type
      data = (data == null || data == "" || typeof(data) == "undefined") ? "" : data
      var strToken = ""
      if(localStorage.getItem('WBtoken')) {
        strToken = localStorage.getItem('WBtoken')
      }
      if (type == "post") {
        data = JSON.stringify(data)
      }
      $.ajax({
        type: type,
        async: true,
        data: data,
        url: url,
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        xhrFields: {
          withCredentials: false
        },
        headers: {
          'Authorization': strToken
        },
        success: function(response) {
          successfn(response)
        },
        error: function(response) {
          errorfn(response.responseJSON)
          try {
            var data = JSON.parse(response.responseText)
            if(response.status === 422) {
              for(var error in data['errors']) {
                var message = data['errors'][error][0]
                break
              }
            } else {
              var message = data['message']
              if(response.status === 401) {
                console.log('认证失败')
                localStorage.removeItem('WBtoken')
                localStorage.removeItem('stuInfo')
                sessionStorage.removeItem('firstToken')
                sessionStorage.removeItem('stusInfo')
                window.location.href = "/"
              }
            }
          } catch(e) {
            console.log("error=" + e)
            $.warningModal({
              type: 'alert',
              content: '网络错误，请稍后重试',
              confirm: function() {}
            })
          }

        },
        complete: function(response) {

        }
      })
    },
    //第一次ajax
    firstAjax: function (url, data, type, successfn, errorfn,completefn) {
      type = (type == null || type == "" || typeof(type) == "undefined") ? "post" : type
      data = (data == null || data == "" || typeof(data) == "undefined") ? "" : data
      if (type == "post") {
        data = JSON.stringify(data)
      }
      $('.loading').show()
      $.ajax({
        type: type,
        async: true,
        data: data,
        url: url,
        // crossDomain: true,
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        xhrFields: {
          withCredentials: false
        },
        headers: {
        },
        success: function (response) {
          $('.loading').hide()
          successfn(response)
        },
        error: function (response) {
          $('.loading').hide()
          errorfn(response.responseJSON)
          try {
            var data = JSON.parse(response.responseText)
            if (response.status === 422) {
              for (var error in data['errors']) {
                var message = data['errors'][error][0]
                break
              }
            } else {
              var message = data['message']
              // if(response.status === 401){
              //   window.location.href = "/"
              // }
            }
            errorfn(data)
          } catch (e) {
            errorfn(e)
          }
        }
      })
    },
    //手机号码校验
    fnCheckMobile: function(value) {
      // if ( /^((1[3,4,5,6,7,8][0-9]{1})+\d{8})$/.test(value) ) {
      if ( value.length==11 ) {
        return true
      } else {
        return false
      }
    },
    //长度不为空校验
    fnCheckLength: function(value) {
      if (value.length>0) {
        return true
      } else {
        return false
      }
    },
    //长度不为空校验
    fnCheckLoginLength: function(a,b) {
      if (a.length>0&&b.length>0) {
        return true
      } else {
        return false
      }
    },
    //设置cookie
    setCookie: function(cookiename, cookievalue, days) {
      var date = new Date()
      date.setTime(date.getTime() + Number(days) * 24 * 3600 * 1000)
      document.cookie = cookiename + "=" + escape(cookievalue) + "; path=/;expires = " + date.toGMTString()
    },
    //获取cookie
    getCookie: function(cookiename) {
      var nameEQ = cookiename + "="
      var ca = document.cookie.split(';') //把cookie分割成组
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i] //取得字符串
        while(c.charAt(0) == ' ') { //判断一下字符串有没有前导空格
          c = c.substring(1, c.length) //有的话，从第二位开始取
        }
        if(c.indexOf(nameEQ) == 0) { //如果含有我们要的name
          return unescape(c.substring(nameEQ.length, c.length)) //解码并截取我们要值
        }
      }
      return false
    },
    //删除cookie中所有定变量函数
    delAllCookie: function() {
      var myDate = new Date()
      myDate.setTime(-1000) //设置时间
      var data = document.cookie
      var dataArray = data.split("; ")
      for(var i = 0; i < dataArray.length; i++) {
        var varName = dataArray[i].split("=")
        document.cookie = varName[0] + "=''; expires=" + myDate.toGMTString()
      }
    },
    //删除指定cookie
    delcookie: function(myname) {
      var deldate = new Date()
      deldate.setDate(deldate.getDate() - 1)
      var key = WB.getCookie(myname)
      if(key != null) {
        document.cookie = myname + "=" + key + ";expires=" + deldate.toGMTString()
      }
    },
    //设置头信息
    setheader: function(tk) {
      var token = getCookie(tk)
      if(token) {
        $.ajaxSetup({
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token)
          }
        });
      } else {
        location.href = "/"
      }
    },
    // 删除所有HTML标签
    removeHtmlTab: function(tab) {
      return tab.replace(/<[^<>]+?>/g,'')
    },
    // 普通字符转换成转意符
    html2Escape: function(sHtml) {
      return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];})
    },
    // 转意符换成普通字符
    escape2Html: function(str) {
      var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','ldquo':'“','rdquo':'”'}
      return str.replace(/&(lt|gt|nbsp|amp|quot|ldquo|rdquo);/ig,function(all,t){return arrEntities[t];})
    },
    // &nbsp;转成空格
    nbsp2Space: function(str) {
      var arrEntities = {'nbsp' : ' '}
      return str.replace(/&(nbsp);/ig, function(all, t){return arrEntities[t]})
    },
    // 回车转为br标签
    return2Br: function(str) {
      return str.replace(/\r?\n/g,"<br />")
    },
    // 去除开头结尾换行,并将连续3次以上换行转换成2次换行
    trimBr: function(str) {
      str=str.replace(/((\s|&nbsp;)*\r?\n){3,}/g,"\r\n\r\n")//限制最多2次换行
      str=str.replace(/^((\s|&nbsp;)*\r?\n)+/g,'')//清除开头换行
      str=str.replace(/((\s|&nbsp;)*\r?\n)+$/g,'')//清除结尾换行
      return str
    },
    // 将多个连续空格合并成一个空格
    mergeSpace: function(str) {
      str=str.replace(/(\s|&nbsp;)+/g,' ')
      return str
    },
    // 秒数转分秒00：00
    timeStr: function (num) {
      return [
        parseInt(num / 60 % 60),
        parseInt(num % 60)
      ].join(':').replace(/\b(\d)\b/g, '0$1')
    }
  }
})(window)
