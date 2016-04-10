'use strict';

const minimist = require('minimist');

class Termimori {
	/**
	 * create Termimori
	 * @param parent {Element} 
	 * @param prompt {Array<Object>} Keys of Object are name and style.
	 */
	constructor(parent, prompt) {
		this.commandList = {}
		this.history = [];
		this.historyIndex = 0;
		this.element = {};
		this.element.parent = parent;
		this.element.parent.classList.add('termimori');
		this.element.line = document.createElement('div');
		this.element.line.classList.add('line', 'current');
		this.element.prompt = document.createElement('span');
		this.element.prompt.classList.add('prompt');
		prompt.forEach((p) => {
			const e = document.createElement('span');
			e.classList.add(p.name);
			e.innerText = p.text;
			Object.keys(p.style).forEach((k) => {
				e.style[k] = p.style[k];
			});
			this.element.prompt.appendChild(e);
			this.element[p.name] = e;
		});
		this.element.command = document.createElement('span');
		this.element.command.classList.add('command');
		this.element.command.contentEditable = true;
		this.element.command.addEventListener('keydown', this.inputKey.bind(this));
		[this.element.prompt, this.element.command].forEach((a) => this.element.line.appendChild(a));
		parent.appendChild(this.element.line);
		parent.addEventListener('click', () => this.element.command.focus());
	}
	
	inputKey() {
		switch (event.keyCode) {
			case 13:
				event.preventDefault();
				this.newline(this.element.command.innerText.split(';').map((command) => {
					command = command.trim();
					command = minimist(command.split(/\s+/));
					const name = command._[0];
					const f = this.commandList[name];
					return (name === '') ? '' : (f === undefined) ? 'command not found: ' + name : f.call(null, command);
				}));
				this.element.command.innerText = '';
				this.historyIndex = -1;
				break;
			case 9:
				event.preventDefault();
				const end = document.getSelection().anchorOffset;
				const text = this.element.command.innerText;
				const begin = Math.max(text.lastIndexOf(' ', end), 0);
				const commands = Object.keys(this.commandList).filter((a) => a.indexOf(text.slice(begin, end).trim()) !== -1);
				this.newline([commands.join(' ')]);
				if (commands.length === 1) {
					this.element.command.innerText = commands[0];
					const selection = window.getSelection();
					const range = document.createRange();
					range.setStart(this.element.command.firstChild, this.element.command.innerText.length);
					range.setEnd(this.element.command.firstChild, this.element.command.innerText.length);
					selection.removeAllRanges();
					selection.addRange(range);
				}
				break;
			case 38:
				event.preventDefault();
				if (this.history.length > 0) {
					this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
					this.element.command.innerText = this.history[this.historyIndex];
					this.element.command.focus();
				}
				break;
			case 40:
				if (this.historyIndex > -1 && this.history.length > 0) {
					this.historyIndex = Math.max(this.historyIndex - 1, 0);
					this.element.command.innerText = this.history[this.historyIndex];
					this.element.command.focus();
				}
				break;
			default:
				break;
		}
	}
	
	/**
	 * set command
	 * @param {String} command that user enters
	 * @param {Function} f if user enters the command, execute this function and show a return value
	 */
	on(command, f) {
		this.commandList[command] = f;
		return this;
	}
	
	/**
	 * focus element of termimori
	 */
	focus(){
		this.element.command.focus();
	}

	newline(results) {
		const line = document.createElement('div');
		line.classList.add('line');
		const prompt = this.element.prompt.cloneNode(true);
		const command = this.element.command.cloneNode(true);
		this.history.unshift(command.innerText);
		[prompt, command].forEach((a) => line.appendChild(a));
		this.element.parent.insertBefore(line, this.element.line);
		results.forEach((r) => {
			const result = document.createElement('div');
			result.classList.add('result', 'line');
			result.innerText = r;
			this.element.parent.insertBefore(result, this.element.line);
		});
		this.element.parent.scrollTop = this.element.parent.scrollHeight;
	}
}
module.exports = Termimori;