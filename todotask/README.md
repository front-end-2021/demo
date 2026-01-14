npm init -y

# Cài Vue 3 + loader cho .vue
npm i vue
npm i -D webpack webpack-cli webpack-dev-server html-webpack-plugin vue-loader @vue/compiler-sfc css-loader style-loader postcss-loader html-inline-script-webpack-plugin

# (Tùy chọn) thêm dùng cho build product
npm i -D mini-css-extract-plugin

# Cài Tailwind CSS v4 và PostCSS plugin
npm i -D tailwindcss @tailwindcss/postcss postcss

# (Tuỳ chọn) Cài Sass nếu bạn dùng .scss
npm i -D sass sass-loader