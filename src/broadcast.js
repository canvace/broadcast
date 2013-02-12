(function () {
	'use strict';
	var MultiSet = require('multiset');

	/**
	 * Represents a broadcast channel where clients can listen to notifications
	 * or broadcast them to the other clients.
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
			 * Represents a client of a broadcast channel.
			 *
			 * A broadcast channel client may listen to notifications and
			 * broadcast notifications to other clients.
			 *
			 * This inner class cannot be instantiated directly, instances must
			 * be obtained using the
			 * {{#crossLink Channel/register:method}}{{/crossLink}} method.
			 *
			 * @class Channel.Client
			 * @constructor
			 */
			this.Client = function () {
				/**
				 * Waits for a notification. When one arrives, the specified
				 * callback function is called. The data associated to the
				 * notification is passed to the callback function as an
				 * argument.
				 *
				 * @method listen
				 * @param callback {Function} A user-defined callback function
				 * that is called when a notification arrives.
				 * @param callback.data {Any} The data associated to the
				 * notification. This is specified by the client that generated
				 * the notification (see
				 * {{#crossLink Channel.Client/broadcast:method}}{{/crossLink}}).
				 * @return {Function} A function that cancels the listening.
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
				 * Broadcasts a notification to all the clients in the channel.
				 *
				 * @method broadcast
				 * @param data {Any} The data associated to the notification. It
				 * can be any thing and is directly passed to the callback
				 * functions of the clients (see
				 * {{#crossLink Channel.Client/listen:method}}{{/crossLink}}).
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
