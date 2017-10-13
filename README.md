---
title: "[Rails] Vue-outlet for Turbolinks"
date: 2017-10-12 00:00:00
banner: undefined
categories:
- Ruby on Rails
tags:
- vue
- rails
- webpack
- npm
- gem
---

# [Rails] Vue-outlet for Turbolinks

@(Ruby on Rails)[rails, vue, webpack, npm, gem]

###### keywords: `webpacker`

說明如何在 Rails Turbolinks 中搭配使用 Vue。

### Initialize the App

```sh
# initialize the app
rails new rails_sandbox_vue --database=postgresql --webpack=vue

# install package
bundle
yarn
```

### Scaffold the app

```sh
# Scaffold the app
bin/rails g scaffold User name email

# Create database and migrate
bin/rails db:setup
bin/rails db:migrate
```

### Create Vue Component

在 `./app/javascript/` 中建立 vue component `hello_vue.vue`

```html
<!--
./app/javascript/hello_vue.vue
-->

<template>
  <div>
    <h4>{{ message }}</h4>
    <ul>
      <li>Object: {{ obj }} </li>
      <li>Number: {{ num }} </li>
      <li>Array: {{ arr }} </li>
      <li>String: {{ str }} </li>
    </ul>
    </div>
</template>

<script>
export default {
  props: ['obj', 'arr', 'num', 'str'],
  data: function () {
    return {
      message: 'Hello, Vue and Turbolinks'
    }
  }
}
</script>

<style scoped>
h4 {
  font-size: 2em;
  text-align: center;
  color: steelblue;
}
</style>
```

### Create Vue Adapter

在 `./app/javascript/packs/`
中建立 `vue_adapter.js`，在 import Vue 的地方要載入 `vue.esm.js` 可以 compile template 的版本。另外要把需要使用到的 Vue Component 在這裡執行註冊：

```js
// ./app/javascript/packs/vue_adapter.js

// import Vue
import Vue from 'vue/dist/vue.esm.js'

// import your components
import HelloVue from 'hello-vue'

// register your components
Vue.component('hello-vue', HelloVue)

function VueConstructor () {
  let outlets = document.querySelectorAll('[data-vue-component-outlet]')
  outlets.forEach(function (outlet, index) {
    let id = outlet.getAttribute('data-vue-component-outlet')
    new Vue({
      el: '[data-vue-component-outlet=' + id + ']'
    })
  })
}

if (typeof Turbolinks !== 'undefined' && Turbolinks.supported) {
  document.addEventListener('turbolinks:load', VueConstructor)
} else {
  document.addEventListener('DOMContentLoaded', VueConstructor)
}
```

> Notice:
> -import 的 Vue 要匯入的是 vue.esm.js
> -記得註冊使用到的 Vue Component


### add vue_adapter in head

在 layouts/application.html.erb 中的 `head` 中加入 `<%= javascript_pack_tag 'vue_adapter', 'data-turbolinks-track': 'reload' %>`，以及 `<%= stylesheet_pack_tag 'vue_adapter', 'data-turbolinks-track': 'reload' %>`：

```erb
<!-- ./app/views/layouts/application.html.erb -->
<!DOCTYPE html>
<html>
  <head>
    <title>RailsSandboxVue</title>
    <%= csrf_meta_tags %>

    <%= stylesheet_link_tag    'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_include_tag 'application', 'data-turbolinks-track': 'reload' %>

    <%= stylesheet_pack_tag 'vue_adapter', 'data-turbolinks-track': 'reload' %>
    <%= javascript_pack_tag 'vue_adapter', 'data-turbolinks-track': 'reload' %>
  </head>

  <body>
    <%= yield %>
  </body>
</html>
```

> Notice:
> -要把 javascript_pack_tag 放在 head 當中
> -如果 Vue 中有使用 SCSS 則需在 head 中再放入 stylesheet_pack_tag

### Import Vue component in template

我們把 Vue 的組件載入 index.html.erb 中，`data-vue-components-outlet` 這個屬性是關鍵字，後面放要載入的 Vue 組件名稱：


```erb
<!-- ./app/views/users/index.html.erb -->

<!--  ...  -->

<!--  假設這是透過 controller 傳過來的資料  -->
<% @hello_message = {num: 1, str: '2', arr: [1, 2, 3], obj: {name: 'foo', age: 12}} %>

<!-- Import Vue Component -->
<div data-vue-components-outlet="hello-turbolinks">
  <hello-turbolinks
  :obj="<%= @hello_message[:obj].to_json %>"
  :arr="<%= @hello_message[:arr] %>"
  :str="<%= @hello_message[:str] %>"
  :num="<%= @hello_message[:num] %>"
  ></hello-turbolinks>
</div>
<!-- End of Import Vue Component -->

<%= link_to 'New User', new_user_path %>
```

### 完成

分別開兩個 terminal 到 app 目錄底下，分別執行：

```sh
bin/webpack-dev-server
bin/rails s
```

就可以看到 Vue Component 正確運作了。

### 使用 inline-template

依照上面的邏輯，我們可以透過 inline-template 的方式來使用 Vue，這樣就可以把 Vue Template 的部分寫在 erb 中而不用拉到 `.vue` 裡面，以下是所建立的檔案：

```html
<!--  ./app/javascript/hello-vue-inline.vue  -->

<script>
export default {
  props: ['obj', 'arr', 'num', 'str'],
  data: function () {
    return {
      message: 'Hello, Vue in inline-template.'
    }
  }
}
</script>

<style scoped>
h4 {
  font-size: 2em;
  text-align: center;
  color: purple;
}
</style>
```

```js
// ./app/javascript/packs/vue_adapter.js
/**
 * 新增兩行
 * "import HelloVueInline from 'hello-vue-inline'"
 * "Vue.component('hello-vue-inline', HelloVueInline)"
 **/

...

// import your components
import HelloVue from 'hello-vue'
import HelloVueInline from 'hello-vue-inline' // 新增這行

// register your components
Vue.component('hello-vue', HelloVue)
Vue.component('hello-vue-inline', HelloVueInline)

...

```

```erb
<!--  ./app/views/users/index.html.erb  -->
<!--
 - 留意 Use Vue Component by inline-template 的部分
-->

<!--  ...  -->

<% @hello_message = {num: 1, str: '2', arr: [1, 2, 3], obj: {name: 'foo', age: 12}} %>

<!-- Import Vue Component -->
<div data-vue-component-outlet="v-hello-vue">
  <hello-vue
  :obj="<%= @hello_message[:obj].to_json %>"
  :arr="<%= @hello_message[:arr] %>"
  :str="<%= @hello_message[:str] %>"
  :num="<%= @hello_message[:num] %>"
  ></hello-vue>
</div>
<!-- End of Import Vue Component -->

<!-- Use Vue Component by inline-template -->
<div data-vue-component-outlet="v-hello-vue-inline">
  <hello-vue-inline
  :obj="<%= @hello_message[:obj].to_json %>"
  :arr="<%= @hello_message[:arr] %>"
  :str="<%= @hello_message[:str] %>"
  :num="<%= @hello_message[:num] %>"
  inline-template
  >
    <div>
      <h4>{{ message }}</h4>
      <ul>
        <li>Object: {{ obj }} </li>
        <li>Number: {{ num }} </li>
        <li>Array: {{ arr }} </li>
        <li>String: {{ str }} </li>
      </ul>
    </div>
  </hello-vue-inline>
</div>
<!-- End of Vue Component by inline-template -->

<%= link_to 'New User', new_user_path %>
```

### 加入 View Helper

我們也可以寫一個 Rails View Helper 來方便我們使用 Vue 組件：

在 `./app/helpers/` 中建立一支 `vue_helper.rb`：

```ruby
# ./app/helpers/vue_helper.rb
module VueHelper
  def vue_outlet(html_options = {})
    html_options = html_options.reverse_merge(data: {})
    html_options[:data].tap do |data|
      data[:vue_component_outlet] = "_v" + SecureRandom.hex(5)
    end
    html_tag = html_options[:tag] || :div
    html_options.except!(:tag)
    content_tag(html_tag, '', html_options) do
      yield
    end
  end
end
```

使用方式如下：

```erb
<!--
./app/views/users/index.html.erb
-->

<% @hello_message = {num: 1, str: '2', arr: [1, 2, 3], obj: {name: 'foo', age: 12}} %>

<!-- Import Vue Component by Helper -->
<%= vue_outlet do %>
  <hello-turbolinks
  :obj="<%= @hello_message[:obj].to_json %>"
  :arr="<%= @hello_message[:arr] %>"
  :str="<%= @hello_message[:str] %>"
  :num="<%= @hello_message[:num] %>"
  >
<% end %>
<!-- End of Import Vue Component by Helper -->
```

如果 tag 不想要使用 div 可以加上 options：

```erb
<!--
./app/views/users/index.html.erb
-->

<!-- With <p> -->
<%= vue_outlet tag: 'p' do %>
  <hello-turbolinks
  :obj="<%= @hello_message[:obj].to_json %>"
  :arr="<%= @hello_message[:arr] %>"
  :str="<%= @hello_message[:str] %>"
  :num="<%= @hello_message[:num] %>"
  >
<% end %>
<!-- End of With <p> -->
```

## 檔案範例

[template-rails-vue-turbolinks](https://github.com/PJCHENder/template-rails-vue-turbolinks) @ Github

## 開發者

- [Andyyou](https://github.com/andyyou) @ Github

## 參考

- [Make Vue.js works with Ruby on Rails and Turbolinks 5](https://gist.github.com/scottcorgan/b35cb59f21acd392d07020a700d017b7) @ Gist
- [A Vue mixin to fix Turbolinks caching](https://github.com/jeffreyguenther/vue-turbolinks) @ Vue Turbolinks
- [VueJs and Turbolinks](https://github.com/turbolinks/turbolinks/wiki/VueJs-and-Turbolinks) @ turbolinks

