/// <reference path="typings/index.d.ts" />

const _ = require('lodash');
const minimist = require('minimist');

class Termimori {
	/**
	 * @param {Element} parentElement
	 * @param {{color: String, innerText: String}[]} prompt
	 */
	constructor(parentElement, prompt) {
		const element = document.createElement('div');
		element.classList.add('termimori');
		element.addEventListener('click', this.click.bind(this));
		parentElement.appendChild(element);
		const line = document.createElement('div');
		line.classList.add('termimori-line');
		const head = document.createElement('span');
		head.classList.add('termimori-line-head');
		_.forEach(prompt, (p) => {
			const span = document.createElement('span');
			span.style.color = p.color;
			span.innerText = p.innerText;
			head.appendChild(span);
		});
		const tail = document.createElement('span');
		tail.classList.add('termimori-line-tail');
		tail.contentEditable = true;
		tail.addEventListener('keydown', this.keydown.bind(this));
		_.forEach([head, tail], (a) => line.appendChild(a));
		element.appendChild(line);

		this.element = element;
		this.tail = tail;
		this.commands = {};

		this.height = `${0.8 * 10}rem`;
	}

	click() {
		this.caret = this.value.length;
	}

	keydown() {
		const f = {
			kc13: () => {
				event.preventDefault();
				const {parentElement} = this.tail;
				const {args} = this;
				console.log(args);
				const f = this.commands[args._[0]];
				const result = f ? f(this.args) : `termimori: ${args._[0]}: command not found`;
				this.addline(result);
				this.value = '';
			},
			kc9: () => {
				event.preventDefault();
				const blank = _.indexOf(this.value, ' ');
				const caret = document.getSelection().anchorOffset;
				if (!(blank === -1 || caret - 1 < blank)) { return; }
				const re = new RegExp(`^${this.value.slice(0, caret)}`, 'i');
				const list = _.filter(_.keys(this.commands), (a) => a.match(re));
				if (list.length === 0) { return; } else if (list.length === 1) {
					const c = list[0];
					this.newline();
					this.value = _.join(_.concat(c, _.slice(_.split(this.value, ' '), 1)));
					this.caret = c.length;
				} else {
					const head = list[0];
					let headIndex = 0;
					for (let i = 1; i < list.length; i += 1) {
						const length = i === 1 ? head.length : headIndex;
						for (let j = 0; j < length; j += 1) {
							if (head.charCodeAt(j) !== list[i].charCodeAt(j)) {
								headIndex = j;
								break;
							}
						}
					}
					const shead = head.slice(0, headIndex);
					this.addline(_.join(list, ' '));
					this.value = shead;
					this.caret = shead.length;
				}
			}
		}[`kc${event.keyCode}`];
		if (f) { f(); }
	}

	/**
	 * @param {String} name
	 * @param {Function} f
	 */
	on(name, f) {
		this.commands[name] = f;
		return this;
	}

	/**
	 * @param {String} innerText
	 */
	addline(innerText) {
		this.newline();
		const {parentElement} = this.tail;
		const line = document.createElement('div');
		line.classList.add('termimori-line');
		line.innerText = innerText;
		parentElement.parentElement.insertBefore(line, parentElement);

		this.element.scrollTop = this.element.scrollHeight;
	}

	newline() {
		const {parentElement} = this.tail;
		const cloneNode = parentElement.cloneNode(true);
		cloneNode.children[1].contentEditable = false;
		parentElement.parentElement.insertBefore(cloneNode, parentElement);
	}

	get args() {
		return minimist(_.split(this.value, ' '));
	}

	get value() {
		return this.tail.innerText;
	}

	set height(height) {
		this.element.style.height = height;
	}

	set caret(caret) {
		const range = document.createRange();
		const selection = window.getSelection();
		range.setStart(this.tail.firstChild || this.tail, caret);
		range.collapse(true);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	set value(value) {
		this.tail.innerText = value;
	}
}

module.exports = Termimori;