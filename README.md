# Termimori

Termimori allows to create a element like Terminal

（BrowserでTerminalを動かしたいとかではなくて，それっぽいUIを表示する君）

## Usage

```javascript
const termimori = new Termimori(parent, prompt);
```

* `parent`: 親要素となる`Element`を指定する
* `prompt`: Objectの配列で指定する
  * `name`: `this.element.${name}`でアクセスできる（識別子的な）
  * `style`: 表示する際のStyleを指定する
  * `text`: 表示したい文字


```javascript
termimori.on(command, f);
```

* `command`: コマンドの名前
* `f`: 上記コマンドが入力された際に実行する関数
  * `args`: `minimist`によってparseされた引数を得れる
  * `return value`: 上記コマンドを実行した後に表示する文字列

### [Example](http://mimorisuzuko.github.io/termimori/demo/)

```javascript
const Termimori = require('../index.js');
const termimori = new Termimori(document.querySelector('div'), [
	{
		name: 'face',
		style: { color: '#0f0' },
		text: '(*\'-\') < ',
	}
]);
termimori.focus();
termimori.on('zoi', (args) => '今日も1日がんばるぞい！');
termimori.on('tweet', (args) => {
	window.open('http://twitter.com/?status=' + args._[1]);
	return 'a';
});
```

