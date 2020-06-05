;(function() {
    'use strict';

    const _createClass = function () {
        function defineProperties(target, props) {
            for (let i = 0; i < props.length; i++) {
                const descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    /*!
     * https://github.com/leonardosnt/mc-player-counter
     *
     * Copyright (C) 2017 leonardosnt
     * Licensed under the MIT License. See LICENSE file in the project root for full license information.
     */

    const PlayerCounter = function () {
        function PlayerCounter(_ref) {
            let ip = _ref.ip,
                element = _ref.element,
                format = _ref.format,
                refreshRate = _ref.refreshRate;

            _classCallCheck(this, PlayerCounter);

            format = format || '{online}';
            refreshRate = refreshRate || 60 * 1000;

            if (!ip) {
                throw TypeError('ip cannot be null or undefined');
            }

            if (!element) {
                throw TypeError('element cannot be null or undefined');
            }

            const ipAddress = ip.split(':');
            this.ip = ipAddress[0];
            this.port = ipAddress[1] || '25565';

            this.format = format;
            this.element = typeof element === 'string' ? document.querySelector(element) : element;

            this.runQuery();
            this.timerId = setInterval(this.runQuery.bind(this), refreshRate);
        }

        _createClass(PlayerCounter, [{
            key: 'runQuery',
            value: function runQuery() {
                const _this = this;

                // I'll use XMLHttpRequest because it has a better browser support
                // than fetch & Promise.
                const request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState !== 4 || request.status !== 200) return;

                    const FORMAT_REGEX = /{\b(online|max)\b}/ig;
                    const response = JSON.parse(request.responseText);
                    const displayStatus = _this.element.getAttribute('data-playercounter-status');

                    // Display server status.
                    // offline/online
                    if (displayStatus !== null) {
                        _this.element.innerText = response.online ? 'online' : 'offline';
                        return;
                    }

                    // Display online players
                    // Make sure server is online
                    if (response.online) {
                        _this.element.innerHTML = _this.format.replace(FORMAT_REGEX, function (_, group) {
                            return (
                                // Change 'online' to 'now' to keep backward compatibility
                                response.players[group === 'online' ? 'now' : group]
                            );
                        });
                    }
                };
                request.open('GET', 'https://mcapi.us/server/status?ip=' + this.ip + '&port=' + this.port);
                request.send();
            }
        }]);

        return PlayerCounter;
    }();

    const onDomLoad = function onDomLoad() {
        const elements = document.querySelectorAll('[data-playercounter-ip]');

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];

            new PlayerCounter({
                element: element,
                ip: element.getAttribute('data-playercounter-ip'),
                format: element.getAttribute('data-playercounter-format'),
                refreshRate: element.getAttribute('data-playercounter-refreshRate')
            });
        }
    };

    if (document.readyState === 'complete') {
        onDomLoad();
    } else {
        window.onload = onDomLoad;
    }

    window.PlayerCounter = PlayerCounter;
}());