(function () {
	'use strict';
	var MultiSet = require('multiset');

	/**
	 * TODO
	 *
	 * @class Channel
	 * @constructor
	 */
	module.exports = function Channel() {
		var mailboxes = new MultiSet();

		function Mailbox() {
			var removed = false;
			var remove = (function (remove) {
				return function () {
					removed = true;
					remove();
				};
			})(mailboxes.add(this));

			var timeout = null;
			var timeoutValue = 60000; // 1 minute

			var queue = [];
			var listeners = new MultiSet();

			this.broadcast = function (data) {
				if (listeners.forEach(function (listener, remove) {
					listener(data);
					remove();
					return false;
				})) {
					if (listeners.isEmpty() && (timeout === null)) {
						setTimeout(remove, timeoutValue);
					}
				} else {
					queue.push(data);
				}
			};

			/**
			 * TODO
			 *
			 * @class Channel.Client
			 * @constructor
			 */
			this.Client = function () {
				/**
				 * TODO
				 *
				 * @method listen
				 * @param callback {Function} TODO
				 * @return {Function} TODO
				 */
				this.listen = function (callback) {
					if (removed) {
						throw 'timeout';
					} else {
						var remover = null;
						if (queue.length) {
							callback(queue.shift());
						} else {
							remover = listeners.add(callback);
						}
						if (timeout !== null) {
							clearTimeout(timeout);
							if (listeners.isEmpty()) {
								setTimeout(remove, timeoutValue);
							} else {
								timeout = null;
							}
						}
						return remover;
					}
				};

				/**
				 * TODO
				 *
				 * @method broadcast
				 * @param data {Any} TODO
				 */
				this.broadcast = function (data) {
					if (removed) {
						throw 'timeout';
					} else {
						mailboxes.fastForEach(function (mailbox) {
							mailbox.broadcast(data);
						});
						if (timeout !== null) {
							clearTimeout(timeout);
							timeout = setTimeout(remove, timeoutValue);
						}
					}
				};

				/**
				 * TODO
				 *
				 * @method unregister
				 */
				this.unregister = remove;
			};
		}

		/**
		 * TODO
		 *
		 * @method register
		 * @for Channel
		 * @return {Channel.Client} TODO
		 */
		this.register = function () {
			return new (new Mailbox()).Client();
		};

		/**
		 * TODO
		 *
		 * @method broadcast
		 * @param data {Any} TODO
		 */
		this.broadcast = function (data) {
			mailboxes.fastForEach(function (mailbox) {
				mailbox.broadcast(data);
			});
		};
	};
}());
