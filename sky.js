reated by nailuo on 2017/10/26.
 */
;(function (win) {
    win.sky = {
        /***
         * 封装ajax函数
         * @param {string}opt.type http连接的方式，包括POST和GET两种方式
         * @param {string}opt.url 发送请求的url
         * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
         * @param {object}opt.data 发送的参数，格式为对象类型
         * @param {function}opt.success ajax发送并接收成功调用的回调函数
         * @param {function}opt.fail ajax发送失败的回调函数
         *
         *   使用方法
         *   sky.ajax({
         *       method: 'POST',
         *       url: 'test.php',
         *       data: {
         *           name1: 'value1',
         *           name2: 'value2'
         *       },
         *       success: function (res) {
         *          console.log(res)；
         *       },
         *       fail: function (res) {
         *          console.log(res)
         *       }
         *   });
         */
        ajax:function (opt) {
            opt = opt || {};
            opt.method = (opt.method==null?"GET":opt.method.toUpperCase()) || 'POST';
            opt.url = opt.url || '';
            opt.async = opt.async || true;
            opt.data = opt.data || null;
            opt.success = opt.success || function () {};
            opt.fail = opt.fail || function () {};
            var xmlHttp = null;
            if (XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            }
            else {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }var params = [];
            for (var key in opt.data){
                params.push(key + '=' + opt.data[key]);
            }
            var postData = params.join('&');
            if (opt.method.toUpperCase() === 'POST') {
                xmlHttp.open(opt.method, opt.url, opt.async);
                xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xmlHttp.send(postData);
            }
            else if (opt.method.toUpperCase() === 'GET') {
                xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
                xmlHttp.send(null);
            }
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    opt.success(xmlHttp.responseText);
                }else{
                    opt.fail(xmlHttp.responseText);
                }
            };
        },
        /**
         * 获取 id  DOM
         * @param id
         * @returns {Element}
         */
        $:function (id) {
            return document.getElementById(id);
        },
        /***
         * 序列化query
         * @returns {{}}
         */
        queryParse: function () {
            var queryObj = {}; // query对象
            var arr = [];
            var queryStr = decodeURIComponent(window.location.search).substring(1);
            if(queryStr){
                if(queryStr.indexOf('&') > -1)
                    arr = queryStr.split('&');
                else{
                    arr.push(queryStr);
                }
                arr.forEach(function (n, i) {
                    var kv = n.split('=');
                    queryObj[kv[0]] = isNaN(kv[1] * 1) ? kv[1] : kv[1] * 1;
                });
            }
            return queryObj;
        },
        // 包装post请求data
        paramsParse: function (param) {
            var params = new URLSearchParams();
            for(var key in param){
                params.append(key, param[key]);
            }
            return params;
        },
        /***
         * 生成假的uuid
         * @returns {string}
         */
        getUUID: function () {
            var d = new Date().getTime();
            if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        },
        /***
         * 设置cookie
         * @param key
         * @param value
         * @param time
         */
        setCookie: function(key, value, time) {
            var Days = time || 7;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = key + "="+ value + ";expires=" + exp.toGMTString();
        },
        /***
         * 获取cookie
         * @param key
         * @returns {*}
         */
        getCookie: function(key) {
            var arr,reg=new RegExp("(^| )"+ key +"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return arr[2];
            else
                return null;
        },
        /***
         * 删除cookie
         * @param key
         */
        delCookie: function(key) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.getCookie(key);
            if(cval != null)
                document.cookie = key + "="+ cval +";expires="+exp.toGMTString();
        },
        /**
         * 去重 1
         * 字母的大小写视为一致，比如'a'和'A'，保留一个就可以了！
         * array：表示要去重的数组，必填
         * isSorted：表示函数传入的数组是否已排过序，如果为 true，将会采用更快的方法进行去重
         * iteratee：传入一个函数，可以对每个元素进行重新的计算，然后根据处理的结果进行去重
         * 
         * 使用方法
         * unique(array3, false, function(item){
         *      return typeof item == 'string' ? item.toLowerCase() : item
         * })
         * */
        toLowerunique:function (array, isSorted, iteratee) {
            var res = [];
            var seen = [];

            for (var i = 0, len = array.length; i < len; i++) {
                var value = array[i];
                var computed = iteratee ? iteratee(value, i, array) : value;
                if (isSorted) {
                    if (!i || seen !== computed) {
                        res.push(value)
                    }
                    seen = computed;
                }
                else if (iteratee) {
                    if (seen.indexOf(computed) === -1) {
                        seen.push(computed);
                        res.push(value);
                    }
                }
                else if (res.indexOf(value) === -1) {
                    res.push(value);
                }
            }
            return res;
        },
        /***
         * 数组中 当保留 数字 1  与  字符串 '1' 时
         * @param array
         * @returns {Array.<T>}
         */
        stringUnique:function (array) {
            return array.concat().sort().filter(function(item, index, array){
                return !index || item !== array[index - 1]
            })
        },
        /***
         * 去重
         * @param array
         * @returns {Array}
         */
        unique:function(array) {
            var res = [];
            for(var i =0;i<array.length;i++){
                var current = parseInt(array[i]);
                if (res.indexOf(current) === -1){
                    res.push(current)
                }
            }
            return res;
        },
        /***
         * 乱序
         * @param a  数组
         * @returns {a} 乱序后的数组
         */
        shuffle:function (a) {
            var j, x, i;
            for (i = a.length; i; i--) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }
            return a;
        },
        /**
         * 上传文件 获取文件名字
         * @param pathfilename  input(value)
         * @returns {*}
         * @constructor
         */
        GetExtensionFileName:function(pathfilename){
            var reg = /(\\+)/g;
            var pfn = pathfilename.replace(reg, "#");
            var arrpfn = pfn.split("#");
            var fn = arrpfn[arrpfn.length - 1];
            var arrfn = fn.split(".");
            return arrfn[arrfn.length - 1];
        }
}
})(window);
