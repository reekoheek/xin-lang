# xin-lang

```sh
npm i xin-lang
```

## How to use

Create instance of `xin-lang` at global.

```js
import { Lang } from 'xin-lang';

let lang = window.lang = new Lang();
lang.putTranslations('en', {
  'Home': 'Home',
});
lang.putTranslations('en', {
  'Home': 'Rumah',
});
```

To use programmatically in javascript

```js
let result = window.lang.translate('Home');
console.log(result); // show me the result
```

To use from component template scope

```html
<a href="#">[[__global.lang.translate("Home")]]</a>
```
