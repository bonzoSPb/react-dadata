"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Highlighter = require("react-highlight-words");
var react_textarea_autosize_1 = require("react-textarea-autosize");
require("./react-dadata.css");
var ReactDadata = (function (_super) {
    __extends(ReactDadata, _super);
    function ReactDadata(props) {
        var _this = _super.call(this, props) || this;
        _this.onInputFocus = function (e) {
            if (!_this.props.readOnly) {
                _this.setState({ inputFocused: true });
                if (_this.state.suggestions.length == 0) {
                    _this.fetchSuggestions();
                }
            }
            var _a = _this.props.onFocus, onFocus = _a === void 0 ? function () { } : _a;
            onFocus(e);
        };
        _this.onInputBlur = function (e) {
            _this.setState({ inputFocused: false });
            if (_this.state.suggestions.length == 0) {
                _this.fetchSuggestions();
            }
            var _a = _this.props.onBlur, onBlur = _a === void 0 ? function () { } : _a;
            onBlur(e);
        };
        _this.switchLanguage = function (string) {
            var letters = {
                q: 'й', w: 'ц', e: 'у', r: 'к', t: 'е', y: 'н', u: 'г', i: 'ш', o: 'щ', p: 'з', '[': 'х', ']': 'ъ', a: 'ф', s: 'ы', d: 'в', f: 'а', g: 'п', h: 'р', j: 'о', k: 'л', l: 'д', ';': 'ж', '\'': 'э', z: 'я', x: 'ч', c: 'с', v: 'м', b: 'и', n: 'т', m: 'ь', ',': 'б', '.': 'ю', Q: 'Й', W: 'Ц', E: 'У', R: 'К', T: 'Е', Y: 'Н', U: 'Г', I: 'Ш', O: 'Щ', P: 'З', '{': 'Х', '}': 'Ъ', A: 'Ф', S: 'Ы', D: 'В', F: 'А', G: 'П', H: 'Р', J: 'О', K: 'Л', L: 'Д', ':': 'Ж', '"': 'Э', Z: '?', X: 'ч', C: 'С', V: 'М', B: 'И', N: 'Т', M: 'Ь', '<': 'Б', '>': 'Ю', '`': 'ё', '~': 'Ё',
            };
            var value = string.split('');
            var removeSpace = false;
            if (value.slice(-1)[0] === ' ') {
                value.pop();
                removeSpace = true;
            }
            var lastChar = value.slice(-1)[0];
            Object.keys(letters).forEach(function (letter) {
                if (letter === lastChar) {
                    value.pop();
                    value.push(letters[letter]);
                }
            });
            if (removeSpace) {
                value.push(' ');
            }
            return value.join('');
        };
        _this.onInputChange = function (event) {
            var value = event.target.value;
            if (_this.props.translate) {
                value = _this.switchLanguage(value);
            }
            if (_this.props.firstCapital) {
                value = value.toLowerCase();
                value = value.charAt(0).toUpperCase() + value.slice(1);
            }
            _this.setState({ query: value, inputQuery: value, suggestionsVisible: true }, function () {
                if (_this.props.validate) {
                    _this.props.validate(value);
                }
                ;
                if (_this.props.onChange) {
                    _this.props.onChange({
                        value: value,
                        unrestricted_value: '',
                        data: {},
                    });
                }
                _this.fetchSuggestions();
            });
        };
        _this.onKeyPress = function (event) {
            if (event.which == 40) {
                // Arrow down
                event.preventDefault();
                if (_this.state.suggestionIndex < _this.state.suggestions.length) {
                    var newSuggestionIndex = _this.state.suggestionIndex + 1;
                    var newInputQuery = _this.state.suggestions[newSuggestionIndex].value;
                    _this.setState({ suggestionIndex: newSuggestionIndex, query: newInputQuery });
                }
            }
            else if (event.which == 38) {
                // Arrow up
                event.preventDefault();
                if (_this.state.suggestionIndex >= 0) {
                    var newSuggestionIndex = _this.state.suggestionIndex - 1;
                    var newInputQuery = newSuggestionIndex == -1 ? _this.state.inputQuery : _this.state.suggestions[newSuggestionIndex].value;
                    _this.setState({ suggestionIndex: newSuggestionIndex, query: newInputQuery });
                }
            }
            else if (event.which == 13) {
                // Enter
                event.preventDefault();
                if (_this.state.suggestionIndex >= 0) {
                    _this.selectSuggestion(_this.state.suggestionIndex);
                }
            }
        };
        _this.fetchSuggestions = function () {
            if (_this.xhr) {
                _this.xhr.abort();
            }
            _this.xhr = new XMLHttpRequest();
            var url;
            var params;
            if (_this.props.suggestionType === 'bank') {
                url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank";
                params = {
                    query: _this.state.query,
                };
            }
            else if (_this.props.suggestionType === 'fms') {
                url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fms_unit";
                params = {
                    query: _this.state.query,
                };
            }
            else if (_this.props.suggestionType === 'fio') {
                url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/fio";
                params = {
                    query: _this.state.query,
                    parts: _this.props.parts,
                };
            }
            else if (_this.props.suggestionType === 'party') {
                url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
                params = {
                    query: _this.state.query,
                };
            }
            else {
                url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address?5";
                params = {
                    query: _this.state.query,
                    count: 10,
                    to_bound: {
                        value: _this.props.bounds,
                    },
                    from_bound: {
                        value: _this.props.bounds,
                    },
                    locations: [{
                            country: _this.props.country,
                        }],
                };
            }
            _this.xhr.open("POST", url);
            _this.xhr.setRequestHeader("Accept", "application/json");
            _this.xhr.setRequestHeader("Authorization", "Token " + _this.props.token);
            _this.xhr.setRequestHeader("Content-Type", "application/json");
            _this.xhr.send(JSON.stringify(params));
            _this.xhr.onreadystatechange = function () {
                if (_this.xhr.readyState != 4) {
                    return;
                }
                if (_this.xhr.status == 200) {
                    var responseJson = JSON.parse(_this.xhr.response);
                    if (responseJson && responseJson.suggestions) {
                        _this.setState({ suggestions: responseJson.suggestions, suggestionIndex: -1 });
                    }
                }
            };
        };
        _this.onSuggestionClick = function (index, event) {
            event.stopPropagation();
            _this.selectSuggestion(index);
        };
        _this.onSuggestionTouch = function (index, event) {
            event.stopPropagation();
            _this.selectSuggestion(index);
        };
        _this.selectSuggestion = function (index) {
            if (_this.state.suggestions.length >= index - 1) {
                _this.setState({ query: _this.state.suggestions[index].value, suggestionsVisible: false, inputQuery: _this.state.suggestions[index].value }, function () {
                    _this.fetchSuggestions();
                    setTimeout(function () { return _this.setCursorToEnd(_this.textInput); }, 100);
                });
                if (_this.props.onChange) {
                    _this.props.onChange(_this.state.suggestions[index]);
                }
            }
        };
        _this.setCursorToEnd = function (element) {
            var valueLength = element.value.length;
            if (element.selectionStart || element.selectionStart == '0') {
                // Firefox/Chrome
                element.selectionStart = valueLength;
                element.selectionEnd = valueLength;
                element.focus();
            }
        };
        _this.getHighlightWords = function () {
            var wordsToPass = ['г', 'респ', 'ул', 'р-н', 'село', 'деревня', 'поселок', 'пр-д', 'пл', 'к', 'кв', 'обл', 'д'];
            var words = _this.state.inputQuery.replace(',', '').split(' ');
            words = words.filter(function (word) {
                return wordsToPass.indexOf(word) < 0;
            });
            return words;
        };
        _this.state = {
            query: _this.props.query ? _this.props.query : '',
            inputQuery: _this.props.query ? _this.props.query : '',
            inputFocused: false,
            suggestions: [],
            suggestionIndex: -1,
            suggestionsVisible: true,
            isValid: false
        };
        return _this;
    }
    ReactDadata.prototype.componentDidMount = function () {
        if (this.props.autoload && this.state.query) {
            this.fetchSuggestions();
        }
    };
    ;
    ReactDadata.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.query !== prevProps.query) {
            this.setState({ query: this.props.query ? this.props.query : '' });
        }
    };
    ReactDadata.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: "react-dadata react-dadata__container" },
            React.createElement("div", null,
                React.createElement(react_textarea_autosize_1.default, { className: "react-dadata__input " + this.props.className, placeholder: this.props.placeholder ? this.props.placeholder : '', value: this.state.query, id: this.props.id, ref: function (input) { _this.textInput = input; }, onChange: this.onInputChange, onKeyPress: this.onKeyPress, onKeyDown: this.onKeyPress, onFocus: this.onInputFocus, onBlur: this.onInputBlur, autoFocus: this.props.autoFocus, validate: this.props.validate, autoComplete: this.props.autocomplete ? this.props.autocomplete : 'off', name: this.props.name, disabled: this.props.disabled, required: this.props.required, readOnly: this.props.readOnly })),
            this.state.inputFocused && this.state.suggestionsVisible && this.state.suggestions && this.state.suggestions.length > 0 && React.createElement("div", { className: "react-dadata__suggestions" },
                React.createElement("div", { className: "react-dadata__suggestion-note" }, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0438\u043B\u0438 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u0435 \u0432\u0432\u043E\u0434"),
                this.state.suggestions.map(function (suggestion, index) {
                    var suggestionClass = 'react-dadata__suggestion';
                    if (index == _this.state.suggestionIndex) {
                        suggestionClass += ' react-dadata__suggestion--current';
                    }
                    if (_this.props.suggestionType === 'bank') {
                        return React.createElement("div", { key: suggestion.data.bic, onTouchStart: _this.onSuggestionTouch.bind(_this, index), onMouseDown: _this.onSuggestionClick.bind(_this, index), className: suggestionClass },
                            React.createElement(Highlighter, { highlightClassName: "react-dadata--highlighted", autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.value }),
                            React.createElement("div", { className: "react-dadata__suggestion__subtext" },
                                React.createElement(Highlighter, { highlightClassName: "react-dadata--highlighted", autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.data.bic }),
                                " ",
                                React.createElement(Highlighter, { highlightClassName: "react-dadata--highlighted", autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.data.address.value })));
                    }
                    else if (_this.props.suggestionType === 'party') {
                        return React.createElement("div", { key: suggestion.data.inn, onTouchStart: _this.onSuggestionTouch.bind(_this, index), onMouseDown: _this.onSuggestionClick.bind(_this, index), className: suggestionClass },
                            React.createElement(Highlighter, { highlightClassName: "react-dadata--highlighted", autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.value }),
                            React.createElement("div", { className: "react-dadata__suggestion__subtext" },
                                React.createElement(Highlighter, { highlightClassName: "react-dadata--highlighted", autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.data.inn }),
                                " ",
                                React.createElement(Highlighter, { highlightClassName: "react-dadata--highlighted", autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.data.address.value })));
                    }
                    else if (_this.props.suggestionType === 'fms') {
                        return React.createElement("div", { key: "" + suggestion.value + suggestion.data.code, onTouchStart: _this.onSuggestionTouch.bind(_this, index), onMouseDown: _this.onSuggestionClick.bind(_this, index), className: suggestionClass },
                            React.createElement(Highlighter, { highlightClassName: "react-dadata--highlighted", autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.value }));
                    }
                    else if (_this.props.suggestionType === 'fio') {
                        return React.createElement("div", { key: "" + suggestion.value, onTouchStart: _this.onSuggestionTouch.bind(_this, index), onMouseDown: _this.onSuggestionClick.bind(_this, index), className: suggestionClass },
                            React.createElement(Highlighter, { highlightClassName: "react-dadata--highlighted", autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.value }));
                    }
                    else {
                        return React.createElement("div", { key: suggestion.value, onTouchStart: _this.onSuggestionTouch.bind(_this, index), onMouseDown: _this.onSuggestionClick.bind(_this, index), className: suggestionClass },
                            React.createElement(Highlighter, { highlightClassName: "react-dadata--highlighted", autoEscape: true, searchWords: _this.getHighlightWords(), textToHighlight: suggestion.value }));
                    }
                }))));
    };
    return ReactDadata;
}(React.PureComponent));
exports.ReactDadata = ReactDadata;
