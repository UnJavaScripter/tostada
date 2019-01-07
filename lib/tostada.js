"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tostada =
/*#__PURE__*/
function () {
  function Tostada() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      position: 'bottom-center'
    };

    _classCallCheck(this, Tostada);

    this.__globalOptions = options;
    var styles = document.createElement('style');
    var containerIdentificator = '--tst--toast-container';

    var position = this.__getOptions().getToastsPosition();

    styles.innerHTML = "\n      .--tst--toast-container {\n        display: flex;\n        justify-content: ".concat(position.x.propValue, "\n      }\n      .--tst--tostada {\n        background-color: #1f1f1f;\n        color: #f3f3f3;\n        padding: 0.75rem;\n        margin-").concat(position.y.value, ": 0.6875rem;\n        font-family: sans-serif;\n        ").concat(position.y.value, ": 0;\n        position: fixed;\n        transform: translateY(100%);\n        opacity: 0;\n        will-change: transform, opacity;\n      }\n      .--tst--visible {\n        transform: translateY(0%);\n        opacity: 1;\n      }\n      .--tst--tostada.--tst--animatable {\n        transition: opacity 0.3s cubic-bezier(0,0,0.3,1), transform 0.5s cubic-bezier(0,0,0.3,1);\n      }\n      .--tst--tostada.--tst--animatable.--tst--visible {\n        transition: opacity 0.5s cubic-bezier(0,0,0.3,1), transform 0.3s cubic-bezier(0,0,0.3,1);\n      }\n    ");
    document.head.appendChild(styles);
    this.toastsContainer = document.createElement('section');
    this.toastsContainer.id = containerIdentificator;
    this.toastsContainer.classList.add(containerIdentificator);
    document.body.appendChild(this.toastsContainer);
  }

  _createClass(Tostada, [{
    key: "__getOptions",
    value: function __getOptions() {
      var _this = this;

      return _objectSpread({}, this.__globalOptions, {
        getToastsPosition: function getToastsPosition() {
          var positionRegEx = new RegExp(/[A-Za-z\u017F\u212A]+/gi);

          var positionValues = _this.__globalOptions.position.match(positionRegEx);

          var x = function x() {
            var value = positionValues[1];

            var propValue = function propValue() {
              switch (value) {
                case 'left':
                  return 'flex-start';

                case 'center':
                  return 'center';

                case 'right':
                  return 'flex-end';

                default:
                  return 'center';
              }
            };

            return {
              value: value,
              propValue: propValue()
            };
          };

          var y = function y() {
            return {
              value: positionValues[0]
            };
          };

          return {
            x: x(),
            y: y()
          };
        }
      });
    }
  }, {
    key: "__createToast",
    value: function __createToast(message, container) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var toastYPosition = this.__getOptions().getToastsPosition().y.value;

      var otherToastsAmount = container.childNodes.length;
      var nextPos = 100 * (otherToastsAmount - 1) + otherToastsAmount * 10;
      var toast = document.createElement('article');
      toast.classList.add('--tst--tostada');
      toast.addEventListener('transitionend', function () {
        _this2.__handleToastRemoval(toast);
      });

      if (this.globalOptions) {
        Object.assign(toast.style, this.globalOptions.style);
      }

      Object.assign(toast.style, options.style);
      window.requestAnimationFrame(function () {
        setTimeout(function () {
          toast.classList.add('--tst--animatable');
          toast.classList.add('--tst--visible');
        }, 0);
      });
      toast.style.transform = "translateY(".concat(toastYPosition === 'bottom' ? '-' : '').concat(nextPos + 100, "%)");
      toast.innerHTML = message;

      this.__crunchToast(toast, options.displayTime);

      return toast;
    }
  }, {
    key: "__crunchToast",
    value: function __crunchToast(elem) {
      var _this3 = this;

      var displayTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1950;
      setTimeout(function () {
        _this3.__hideToast(elem);
      }, displayTime);
    }
  }, {
    key: "__hideToast",
    value: function __hideToast(elem) {
      elem.classList.add('--tst--crunchable');
      elem.classList.remove('--tst--visible');
    }
  }, {
    key: "__handleToastRemoval",
    value: function __handleToastRemoval(elem) {
      var container = elem.parentNode;

      if (elem.classList.contains('--tst--crunchable') && container) {
        var toastYPosition = this.__getOptions().getToastsPosition().y.value;

        var siblings = container.childNodes;
        container.removeChild(elem);

        if (siblings.length) {
          siblings.forEach(function (toast) {
            if (toast.style.transform) {
              toast.style.transform = "translateY(".concat(toastYPosition === 'bottom' ? '-' : '').concat(/\d+/g.exec(toast.style.transform)[0] - 110, "%)");
            }
          });
        }
      }
    }
  }, {
    key: "show",
    value: function show(message, options) {
      this.toastsContainer.appendChild(this.__createToast(message, this.toastsContainer, options));
    }
  }]);

  return Tostada;
}();