module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1680223929628, function(require, module, exports) {
module.exports = require('./dist/index.js').default
module.exports.QQ = require('./dist/index.js').QQ

module.exports.default = module.exports

}, function(modId) {var map = {"./dist/index.js":1680223929629}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1680223929629, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', { value: true });

var pluginPlatformWeapp = require('@tarojs/plugin-platform-weapp');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const components = {
    // ======== 调整属性 ========
    Button: {
        'app-packagename': '',
        'app-bundleid': '',
        'app-connect-id': '',
        'group-id': '',
        'public-id': '',
        'guild-id': '',
        'share-type': '27',
        'share-mode': '[\'qq\', \'qzone\']',
        'aria-label': '',
        'open-id': '',
        'share-message-friend-info': '',
        bindAddFriend: '',
        bindAddGroupApp: ''
    }
};

const PACKAGE_NAME = '@tarojs/plugin-platform-qq';
class QQ extends pluginPlatformWeapp.Weapp {
    /**
     * 1. setupTransaction - init
     * 2. setup
     * 3. setupTransaction - close
     * 4. buildTransaction - init
     * 5. build
     * 6. buildTransaction - close
     */
    constructor(ctx, config, pluginOptions) {
        super(ctx, config, pluginOptions);
        this.platform = 'qq';
        this.globalObject = 'qq';
        this.projectConfigJson = 'project.qq.json';
        this.runtimePath = `${PACKAGE_NAME}/dist/runtime`;
        this.fileType = {
            templ: '.qml',
            style: '.qss',
            config: '.json',
            script: '.js',
            xs: '.wxs'
        };
        this.buildTransaction.addWrapper({
            init: this.beforeBuild
        });
    }
    beforeBuild() {
        // 处理 QQ 与微信的组件差异
        this.template.mergeComponents(this.ctx, components);
        this.template.Adapter = {
            if: 'qq:if',
            else: 'qq:else',
            elseif: 'qq:elif',
            for: 'qq:for',
            forItem: 'qq:for-item',
            forIndex: 'qq:for-index',
            key: 'qq:key',
            xs: 'wxs',
            type: 'qq'
        };
    }
}

var index = (ctx, options) => {
    ctx.registerPlatform({
        name: 'qq',
        useConfigName: 'mini',
        fn({ config }) {
            return __awaiter(this, void 0, void 0, function* () {
                const program = new QQ(ctx, config, options);
                yield program.start();
            });
        }
    });
};

exports.QQ = QQ;
exports["default"] = index;
//# sourceMappingURL=index.js.map

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1680223929628);
})()
//miniprogram-npm-outsideDeps=["@tarojs/plugin-platform-weapp"]
//# sourceMappingURL=index.js.map