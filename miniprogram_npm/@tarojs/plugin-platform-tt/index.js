module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1680223929632, function(require, module, exports) {
module.exports = require('./dist/index.js').default

module.exports.default = module.exports
module.exports.TT = require('./dist/index.js').TT

}, function(modId) {var map = {"./dist/index.js":1680223929633}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1680223929633, function(require, module, exports) {


Object.defineProperty(exports, '__esModule', { value: true });

var service = require('@tarojs/service');
var shared = require('@tarojs/shared');
var template = require('@tarojs/shared/dist/template');

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

const _true = '!0';
const _false = '!1';
const _empty = '';
const components = {
    // ======== 调整属性 ========
    Icon: {
        size: '24'
    },
    Button: {
        bindGetPhoneNumber: _empty,
        'data-channel': _empty
    },
    Form: {
        'report-submit-timeout': '0'
    },
    Slider: {
        color: shared.singleQuote('#e9e9e9'),
        'selected-color': shared.singleQuote('#1aad19')
    },
    WebView: {
        'progressbar-color': shared.singleQuote('#51a0d8')
    },
    Video: {
        'play-btn-position': shared.singleQuote('center'),
        'pre-roll-unit-id': _empty,
        'post-roll-unit-id': _empty,
        'vslide-gesture': _false,
        'vslide-gesture-in-fullscreen': _true,
        'enable-play-gesture': _false,
        'show-playback-rate-btn': _false,
        'enable-play-in-background': _false,
        'signature': _empty,
        bindProgress: _empty,
        bindSeekComplete: _empty,
        bindAdLoad: _empty,
        bindAdStart: _empty,
        bindAdEnded: _empty,
        bindAdError: _empty,
        bindAdClose: _empty,
        bindLoadedMetadata: _empty,
        bindPlaybackRateChange: _empty,
        bindMuteChange: _empty,
        bindControlTap: _empty,
        bindEnterBackground: _empty,
        bindCloseBackground: _empty,
        bindLeaveBackground: _empty,
    },
    Ad: {
        fixed: _empty,
        type: shared.singleQuote('banner'),
        scale: '100'
    },
    Textarea: {
        'disable-default-padding': _false,
        'confirm-type': shared.singleQuote('return'),
        'confirm-hold': _false,
        'show-confirm-bar': _true,
        'adjust-position': _true,
        'hold-keyboard': _false
    },
    Canvas: {
        type: _empty
    },
    Map: {
        polygons: '[]',
        rotate: '0',
        skew: '0',
        'max-scale': '19',
        'min-scale': '3',
        'enable-3D': _false,
        'show-compass': _false,
        'show-scale': _false,
        'enable-overlooking': _false,
        'enable-zoom': _true,
        'enable-scroll': _true,
        'enable-rotate': _false,
        'enable-satellite': _false,
        'enable-traffic': _false,
        'enable-poi': _true,
        'enable-building': _true,
        bindLabelTap: _empty,
        bindRegionChange: _empty,
        bindAnchorPointTap: _empty
    },
    // ======== 额外组件 ========
    RtcRoom: {
        'user-id': _empty,
        mode: 'camera',
        'device-position': 'front',
        bindError: _empty
    },
    PayButton: {
        mode: '1',
        'goods-id': _empty,
        'goods-type': _empty,
        'order-status': '0',
        'order-id': _empty,
        'refund-id': _empty,
        'refund-total-amount': _empty,
        'biz-line': '1',
        'marketing-ready': _false,
        bindGetGoodsInfo: _empty,
        bindPlaceOrder: _empty,
        bindError: _empty,
        bindApplyRefund: _empty,
        bindRefund: _empty,
        bindPay: _empty
    },
    ConsumeCard: {
        'order-id': _empty,
        bindConsume: _empty,
        bindRefund: _empty,
        bindApplyRefund: _empty,
        bindError: _empty
    },
    AwemeData: {
        'aweme-id': _empty,
        type: shared.singleQuote('avatar'),
        'disable-default': _empty,
        'default-avatar': _empty,
        'default-text': _empty,
        bindError: _empty
    },
    RateButton: {
        'order-id': _empty,
        bindInit: _empty,
        bindSuccess: _empty,
        bindError: _empty,
    },
    OpenData: {
        type: _empty,
        'default-text': _empty,
        'default-avatar': _empty,
        'use-empty-value': _false,
        bindError: _empty
    }
};

class Template extends template.RecursiveTemplate {
    constructor() {
        super(...arguments);
        this.supportXS = false;
        this.Adapter = {
            if: 'tt:if',
            else: 'tt:else',
            elseif: 'tt:elif',
            for: 'tt:for',
            forItem: 'tt:for-item',
            forIndex: 'tt:for-index',
            key: 'tt:key',
            type: 'tt'
        };
    }
    replacePropName(name, value) {
        if (value === 'eh') {
            const nameLowerCase = name.toLowerCase();
            if (nameLowerCase === 'bindlongtap')
                return 'bindlongpress';
            return nameLowerCase;
        }
        return name;
    }
}

const PACKAGE_NAME = '@tarojs/plugin-platform-tt';
class TT extends service.TaroPlatformBase {
    /**
     * 1. setupTransaction - init
     * 2. setup
     * 3. setupTransaction - close
     * 4. buildTransaction - init
     * 5. build
     * 6. buildTransaction - close
     */
    constructor(ctx, config) {
        super(ctx, config);
        this.platform = 'tt';
        this.globalObject = 'tt';
        this.projectConfigJson = 'project.tt.json';
        this.runtimePath = `${PACKAGE_NAME}/dist/runtime`;
        this.taroComponentsPath = `${PACKAGE_NAME}/dist/components-react`;
        this.fileType = {
            templ: '.ttml',
            style: '.ttss',
            config: '.json',
            script: '.js'
        };
        this.template = new Template();
        this.setupTransaction.addWrapper({
            close: this.modifyTemplate
        });
    }
    /**
     * 增加组件或修改组件属性
     */
    modifyTemplate() {
        this.template.mergeComponents(this.ctx, components);
    }
}

var index = (ctx) => {
    ctx.registerPlatform({
        name: 'tt',
        useConfigName: 'mini',
        fn({ config }) {
            return __awaiter(this, void 0, void 0, function* () {
                const program = new TT(ctx, config);
                yield program.start();
            });
        }
    });
};

exports.TT = TT;
exports["default"] = index;
//# sourceMappingURL=index.js.map

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1680223929632);
})()
//miniprogram-npm-outsideDeps=["@tarojs/service","@tarojs/shared","@tarojs/shared/dist/template"]
//# sourceMappingURL=index.js.map