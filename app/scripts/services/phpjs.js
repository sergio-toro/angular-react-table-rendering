(function (){
    'use strict';

    /* jshint ignore:start */

    /**
     * @ngdoc service
     * @name angularReactTableRenderingApp.PHPJS
     * @description
     * # PHPJS
     * Service in the angularReactTableRenderingApp.
     */
    angular.module('angularReactTableRenderingApp')
        .service('PHPJS', [
            function() {
                var self = this;

                self.hexdec = function(hex_string) {
                    // discuss at: http://phpjs.org/functions/hexdec/
                    // original by: Philippe Baumann
                    // example 1: hexdec('that');
                    // returns 1: 10
                    // example 2: hexdec('a0');
                    // returns 2: 160

                    hex_string = (hex_string + '')
                    .replace(/[^a-f0-9]/gi, '');
                    return parseInt(hex_string, 16);
                };

                self.bindec = function(binary_string) {
                    //  discuss at: http://phpjs.org/functions/bindec/
                    // original by: Philippe Baumann
                    //   example 1: bindec('110011');
                    //   returns 1: 51
                    //   example 2: bindec('000110011');
                    //   returns 2: 51
                    //   example 3: bindec('111');
                    //   returns 3: 7

                    binary_string = (binary_string + '')
                        .replace(/[^01]/gi, '');
                    return parseInt(binary_string, 2);
                };

                self.sprintf = function() {
                  //  discuss at: http://phpjs.org/functions/sprintf/
                  // original by: Ash Searle (http://hexmen.com/blog/)
                  // improved by: Michael White (http://getsprink.com)
                  // improved by: Jack
                  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                  // improved by: Dj
                  // improved by: Allidylls
                  //    input by: Paulo Freitas
                  //    input by: Brett Zamir (http://brett-zamir.me)
                  //   example 1: sprintf("%01.2f", 123.1);
                  //   returns 1: 123.10
                  //   example 2: sprintf("[%10s]", 'monkey');
                  //   returns 2: '[    monkey]'
                  //   example 3: sprintf("[%'#10s]", 'monkey');
                  //   returns 3: '[####monkey]'
                  //   example 4: sprintf("%d", 123456789012345);
                  //   returns 4: '123456789012345'
                  //   example 5: sprintf('%-03s', 'E');
                  //   returns 5: 'E00'

                  var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
                  var a = arguments;
                  var i = 0;
                  var format = a[i++];

                  // pad()
                  var pad = function (str, len, chr, leftJustify) {
                    if (!chr) {
                      chr = ' ';
                    }
                    var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0)
                      .join(chr);
                    return leftJustify ? str + padding : padding + str;
                  };

                  // justify()
                  var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
                    var diff = minWidth - value.length;
                    if (diff > 0) {
                      if (leftJustify || !zeroPad) {
                        value = pad(value, minWidth, customPadChar, leftJustify);
                      } else {
                        value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
                      }
                    }
                    return value;
                  };

                  // formatBaseX()
                  var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
                    // Note: casts negative numbers to positive ones
                    var number = value >>> 0;
                    prefix = prefix && number && {
                      '2': '0b',
                      '8': '0',
                      '16': '0x'
                    }[base] || '';
                    value = prefix + pad(number.toString(base), precision || 0, '0', false);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad);
                  };

                  // formatString()
                  var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
                    if (precision != null) {
                      value = value.slice(0, precision);
                    }
                    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
                  };

                  // doFormat()
                  var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
                    var number, prefix, method, textTransform, value;

                    if (substring === '%%') {
                      return '%';
                    }

                    // parse flags
                    var leftJustify = false;
                    var positivePrefix = '';
                    var zeroPad = false;
                    var prefixBaseX = false;
                    var customPadChar = ' ';
                    var flagsl = flags.length;
                    for (var j = 0; flags && j < flagsl; j++) {
                      switch (flags.charAt(j)) {
                      case ' ':
                        positivePrefix = ' ';
                        break;
                      case '+':
                        positivePrefix = '+';
                        break;
                      case '-':
                        leftJustify = true;
                        break;
                      case "'":
                        customPadChar = flags.charAt(j + 1);
                        break;
                      case '0':
                        zeroPad = true;
                        customPadChar = '0';
                        break;
                      case '#':
                        prefixBaseX = true;
                        break;
                      }
                    }

                    // parameters may be null, undefined, empty-string or real valued
                    // we want to ignore null, undefined and empty-string values
                    if (!minWidth) {
                      minWidth = 0;
                    } else if (minWidth === '*') {
                      minWidth = +a[i++];
                    } else if (minWidth.charAt(0) == '*') {
                      minWidth = +a[minWidth.slice(1, -1)];
                    } else {
                      minWidth = +minWidth;
                    }

                    // Note: undocumented perl feature:
                    if (minWidth < 0) {
                      minWidth = -minWidth;
                      leftJustify = true;
                    }

                    if (!isFinite(minWidth)) {
                      throw new Error('sprintf: (minimum-)width must be finite');
                    }

                    if (!precision) {
                      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
                    } else if (precision === '*') {
                      precision = +a[i++];
                    } else if (precision.charAt(0) == '*') {
                      precision = +a[precision.slice(1, -1)];
                    } else {
                      precision = +precision;
                    }

                    // grab value using valueIndex if required?
                    value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

                    switch (type) {
                    case 's':
                      return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
                    case 'c':
                      return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
                    case 'b':
                      return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                    case 'o':
                      return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                    case 'x':
                      return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                    case 'X':
                      return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
                        .toUpperCase();
                    case 'u':
                      return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                    case 'i':
                    case 'd':
                      number = +value || 0;
                      // Plain Math.round doesn't just truncate
                      number = Math.round(number - number % 1);
                      prefix = number < 0 ? '-' : positivePrefix;
                      value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                      return justify(value, prefix, leftJustify, minWidth, zeroPad);
                    case 'e':
                    case 'E':
                    case 'f': // Should handle locales (as per setlocale)
                    case 'F':
                    case 'g':
                    case 'G':
                      number = +value;
                      prefix = number < 0 ? '-' : positivePrefix;
                      method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                      textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                      value = prefix + Math.abs(number)[method](precision);
                      return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
                    default:
                      return substring;
                    }
                  };

                  return format.replace(regex, doFormat);
                };

                self.substr = function(str, start, len) {
                  //  discuss at: http://phpjs.org/functions/substr/
                  //     version: 909.322
                  // original by: Martijn Wieringa
                  // bugfixed by: T.Wild
                  // improved by: Onno Marsman
                  // improved by: Brett Zamir (http://brett-zamir.me)
                  //  revised by: Theriault
                  //        note: Handles rare Unicode characters if 'unicode.semantics' ini (PHP6) is set to 'on'
                  //   example 1: substr('abcdef', 0, -1);
                  //   returns 1: 'abcde'
                  //   example 2: substr(2, 0, -6);
                  //   returns 2: false
                  //   example 3: ini_set('unicode.semantics',  'on');
                  //   example 3: substr('a\uD801\uDC00', 0, -1);
                  //   returns 3: 'a'
                  //   example 4: ini_set('unicode.semantics',  'on');
                  //   example 4: substr('a\uD801\uDC00', 0, 2);
                  //   returns 4: 'a\uD801\uDC00'
                  //   example 5: ini_set('unicode.semantics',  'on');
                  //   example 5: substr('a\uD801\uDC00', -1, 1);
                  //   returns 5: '\uD801\uDC00'
                  //   example 6: ini_set('unicode.semantics',  'on');
                  //   example 6: substr('a\uD801\uDC00z\uD801\uDC00', -3, 2);
                  //   returns 6: '\uD801\uDC00z'
                  //   example 7: ini_set('unicode.semantics',  'on');
                  //   example 7: substr('a\uD801\uDC00z\uD801\uDC00', -3, -1)
                  //   returns 7: '\uD801\uDC00z'

                  var i = 0,
                    allBMP = true,
                    es = 0,
                    el = 0,
                    se = 0,
                    ret = '';
                  str += '';
                  var end = str.length;

                  // BEGIN REDUNDANT
                  this.php_js = this.php_js || {};
                  this.php_js.ini = this.php_js.ini || {};
                  // END REDUNDANT
                  switch ((this.php_js.ini['unicode.semantics'] && this.php_js.ini['unicode.semantics'].local_value.toLowerCase())) {
                  case 'on':
                    // Full-blown Unicode including non-Basic-Multilingual-Plane characters
                    // strlen()
                    for (i = 0; i < str.length; i++) {
                      if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
                        allBMP = false;
                        break;
                      }
                    }

                    if (!allBMP) {
                      if (start < 0) {
                        for (i = end - 1, es = (start += end); i >= es; i--) {
                          if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
                            start--;
                            es--;
                          }
                        }
                      } else {
                        var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
                        while ((surrogatePairs.exec(str)) != null) {
                          var li = surrogatePairs.lastIndex;
                          if (li - 2 < start) {
                            start++;
                          } else {
                            break;
                          }
                        }
                      }

                      if (start >= end || start < 0) {
                        return false;
                      }
                      if (len < 0) {
                        for (i = end - 1, el = (end += len); i >= el; i--) {
                          if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
                            end--;
                            el--;
                          }
                        }
                        if (start > end) {
                          return false;
                        }
                        return str.slice(start, end);
                      } else {
                        se = start + len;
                        for (i = start; i < se; i++) {
                          ret += str.charAt(i);
                          if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
                            // Go one further, since one of the "characters" is part of a surrogate pair
                            se++;
                          }
                        }
                        return ret;
                      }
                      break;
                    }
                    // Fall-through
                  case 'off':
                    // assumes there are no non-BMP characters;
                    //    if there may be such characters, then it is best to turn it on (critical in true XHTML/XML)
                  default:
                    if (start < 0) {
                      start += end;
                    }
                    end = typeof len === 'undefined' ? end : (len < 0 ? len + end : len + start);
                    // PHP returns false if start does not fall within the string.
                    // PHP returns false if the calculated end comes before the calculated start.
                    // PHP returns an empty string if start and end are the same.
                    // Otherwise, PHP returns the portion of the string from start to end.
                    return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end);
                  }
                  // Please Netbeans
                  return undefined;
                };

            }
        ]
    );

  /* jshint ignore:end */
})();