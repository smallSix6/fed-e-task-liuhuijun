exports.ids = [1];
exports.modules = {

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getArticles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getYourFeedArticles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addFavorite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return deleteFavorite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getArticle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getComments; });
/* harmony import */ var _plugins_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
 // 获取公共文章列表

const getArticles = params => {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* request */ "b"])({
    method: 'GET',
    url: '/api/articles',
    params
  });
}; // 获取自己关注的文章列表

const getYourFeedArticles = params => {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* request */ "b"])({
    method: 'GET',
    url: '/api/articles/feed',
    params
  });
}; // 添加点赞

const addFavorite = slug => {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* request */ "b"])({
    method: 'POST',
    url: `/api/articles/${slug}/favorite`
  });
}; // 取消点赞

const deleteFavorite = slug => {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* request */ "b"])({
    method: 'DELETE',
    url: `/api/articles/${slug}/favorite`
  });
}; // 获取文章详情

const getArticle = slug => {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* request */ "b"])({
    method: 'GET',
    url: `/api/articles/${slug}`
  });
}; // 获取文章评论

const getComments = slug => {
  return Object(_plugins_request__WEBPACK_IMPORTED_MODULE_0__[/* request */ "b"])({
    method: 'GET',
    url: `/api/articles/${slug}/comments`
  });
};

/***/ }),

/***/ 28:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/index.vue?vue&type=template&id=334491d4&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"article-page"},[_vm._ssrNode("<div class=\"banner\" data-v-334491d4>","</div>",[_vm._ssrNode("<div class=\"container\" data-v-334491d4>","</div>",[_vm._ssrNode("<h1 data-v-334491d4>"+_vm._ssrEscape(_vm._s(_vm.article.title))+"</h1> "),_c('article-meta',{attrs:{"article":_vm.article}})],2)]),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"container page\" data-v-334491d4>","</div>",[_vm._ssrNode("<div class=\"row article-content\" data-v-334491d4><div class=\"col-md-12\" data-v-334491d4>"+(_vm._s(_vm.article.body))+"</div></div> <hr data-v-334491d4> "),_vm._ssrNode("<div class=\"article-actions\" data-v-334491d4>","</div>",[_c('article-meta',{attrs:{"article":_vm.article}})],1),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"row\" data-v-334491d4>","</div>",[_vm._ssrNode("<div class=\"col-xs-12 col-md-8 offset-md-2\" data-v-334491d4>","</div>",[_c('article-comments',{attrs:{"article":_vm.article}})],1)])],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/article/index.vue?vue&type=template&id=334491d4&scoped=true&

// EXTERNAL MODULE: ./api/article.js
var api_article = __webpack_require__(27);

// EXTERNAL MODULE: external "markdown-it"
var external_markdown_it_ = __webpack_require__(26);
var external_markdown_it_default = /*#__PURE__*/__webpack_require__.n(external_markdown_it_);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/components/article-meta.vue?vue&type=template&id=94b1a250&scoped=true&
var article_metavue_type_template_id_94b1a250_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"article-meta"},[_c('nuxt-link',{attrs:{"to":{
      name: 'profile',
      params: {
        username: _vm.article.author.username
      }
    }}},[_c('img',{attrs:{"src":_vm.article.author.image}})]),_vm._ssrNode(" "),_vm._ssrNode("<div class=\"info\" data-v-94b1a250>","</div>",[_c('nuxt-link',{staticClass:"author",attrs:{"to":{
        name: 'profile',
        params: {
          username: _vm.article.author.username
        }
      }}},[_vm._v(_vm._s(_vm.article.author.username))]),_vm._ssrNode(" <span class=\"date\" data-v-94b1a250>"+_vm._ssrEscape(_vm._s(_vm._f("date")(_vm.article.createdAt,'MMM DD, YYYY')))+"</span>")],2),_vm._ssrNode(" <button"+(_vm._ssrClass("btn btn-sm btn-outline-secondary",{active: _vm.article.author.following}))+" data-v-94b1a250><i class=\"ion-plus-round\" data-v-94b1a250></i>\n     \n    Follow Eric Simons\n    <span class=\"counter\" data-v-94b1a250>(10)</span></button>\n    \n  <button"+(_vm._ssrClass("btn btn-sm btn-outline-primary",{active: _vm.article.favorited}))+" data-v-94b1a250><i class=\"ion-heart\" data-v-94b1a250></i>\n     \n    Favorite Post\n    <span class=\"counter\" data-v-94b1a250>(29)</span></button>")],2)}
var article_metavue_type_template_id_94b1a250_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./pages/article/components/article-meta.vue?vue&type=template&id=94b1a250&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/components/article-meta.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var article_metavue_type_script_lang_js_ = ({
  name: "ArticleMeta",
  components: {},
  props: {
    article: {
      type: Object,
      require: true
    }
  },

  data() {
    return {};
  },

  computed: {},
  watch: {},

  created() {},

  mounted() {},

  methods: {},

  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [{
        hid: "description",
        name: "description",
        content: `${this.article.description}`
      }]
    };
  }

});
// CONCATENATED MODULE: ./pages/article/components/article-meta.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_article_metavue_type_script_lang_js_ = (article_metavue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./pages/article/components/article-meta.vue



function injectStyles (context) {
  
  
}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_article_metavue_type_script_lang_js_,
  article_metavue_type_template_id_94b1a250_scoped_true_render,
  article_metavue_type_template_id_94b1a250_scoped_true_staticRenderFns,
  false,
  injectStyles,
  "94b1a250",
  "e53e9a30"
  
)

/* harmony default export */ var article_meta = (component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/components/article-component.vue?vue&type=template&id=6d830cb6&scoped=true&
var article_componentvue_type_template_id_6d830cb6_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._ssrNode("<form class=\"card comment-form\" data-v-6d830cb6><div class=\"card-block\" data-v-6d830cb6><textarea placeholder=\"Write a comment...\" rows=\"3\" class=\"form-control\" data-v-6d830cb6></textarea></div> <div class=\"card-footer\" data-v-6d830cb6><img src=\"http://i.imgur.com/Qr71crq.jpg\" class=\"comment-author-img\" data-v-6d830cb6> <button class=\"btn btn-sm btn-primary\" data-v-6d830cb6>Post Comment</button></div></form> "),_vm._l((_vm.comments),function(comment){return _vm._ssrNode("<div class=\"card\" data-v-6d830cb6>","</div>",[_vm._ssrNode("<div class=\"card-block\" data-v-6d830cb6><p class=\"card-text\" data-v-6d830cb6>"+_vm._ssrEscape(_vm._s(comment.body))+"</p></div> "),_vm._ssrNode("<div class=\"card-footer\" data-v-6d830cb6>","</div>",[_c('nuxt-link',{staticClass:"comment-author",attrs:{"to":{
          name:'profile',
          params: {
            username: comment.author.username
          }
        }}},[_c('img',{staticClass:"comment-author-img",attrs:{"src":comment.author.image}})]),_vm._ssrNode(" \n      <a href class=\"comment-author\" data-v-6d830cb6>Jacob Schmidt</a> "),_c('nuxt-link',{staticClass:"comment-author",attrs:{"to":{
          name:'profile',
          params: {
            username: comment.author.username
          }
        }}},[_vm._v(_vm._s(comment.author.username))]),_vm._ssrNode(" <span class=\"date-posted\" data-v-6d830cb6>"+_vm._ssrEscape(_vm._s(_vm._f("date")(comment.createdAt,'MMM DD, YYYY')))+"</span>")],2)],2)})],2)}
var article_componentvue_type_template_id_6d830cb6_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./pages/article/components/article-component.vue?vue&type=template&id=6d830cb6&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/components/article-component.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var article_componentvue_type_script_lang_js_ = ({
  name: "ArticleComments",
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      comments: [] //文章列表

    };
  },

  computed: {},
  watch: {},

  created() {},

  async mounted() {
    const {
      data
    } = await Object(api_article["e" /* getComments */])(this.article.slug);
    this.comments = data.comments;
  },

  methods: {}
});
// CONCATENATED MODULE: ./pages/article/components/article-component.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_article_componentvue_type_script_lang_js_ = (article_componentvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./pages/article/components/article-component.vue



function article_component_injectStyles (context) {
  
  
}

/* normalize component */

var article_component_component = Object(componentNormalizer["a" /* default */])(
  components_article_componentvue_type_script_lang_js_,
  article_componentvue_type_template_id_6d830cb6_scoped_true_render,
  article_componentvue_type_template_id_6d830cb6_scoped_true_staticRenderFns,
  false,
  article_component_injectStyles,
  "6d830cb6",
  "fe6c49ac"
  
)

/* harmony default export */ var article_component = (article_component_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/article/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var articlevue_type_script_lang_js_ = ({
  name: "ArticleIndex",
  components: {
    ArticleMeta: article_meta,
    articleComments: article_component
  },
  props: {},

  data() {
    return {};
  },

  computed: {},
  watch: {},

  created() {},

  mounted() {},

  methods: {},

  async asyncData({
    params
  }) {
    const {
      data
    } = await Object(api_article["c" /* getArticle */])(params.slug);
    const {
      article
    } = data;
    const md = new external_markdown_it_default.a();
    article.body = md.render(article.body);
    return {
      article
    };
  }

});
// CONCATENATED MODULE: ./pages/article/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_articlevue_type_script_lang_js_ = (articlevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./pages/article/index.vue



function article_injectStyles (context) {
  
  
}

/* normalize component */

var pages_article_component = Object(componentNormalizer["a" /* default */])(
  pages_articlevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  article_injectStyles,
  "334491d4",
  "c78391b6"
  
)

/* harmony default export */ var pages_article = __webpack_exports__["default"] = (pages_article_component.exports);

/***/ })

};;
//# sourceMappingURL=1.js.map