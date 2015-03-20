(function () {

    'use strict';

    /**
     * @ngdoc filter
     * @name angularReactTableRenderingApp.filter:gpmFilters
     * @function
     * @description
     * # gpmFilters
     * Filter in the angularReactTableRenderingApp.
     */
    angular.module('angularReactTableRenderingApp')
        .filter(
            'startFrom', function() {
                return function(input, start) {
                    if (input) {
                        start = +start; //parse to int
                        return input.slice(start);
                    }
                };
            }
        )

        .filter('momentDateTime', function() {
            return function(text, timezone, format) {
                if (text) {
                    timezone = timezone || 'Europe/Madrid';
                    format   = format || 'DD/MM/YYYY HH:mm';
                    return window.moment.tz(text, timezone).isValid() ?
                        window.moment.tz(text, timezone).format(format) :
                        'Fecha erronea'
                    ;
                }
            };
        })

        .filter('gpmNumber', [
            '$filter',
            function($filter) {

                return function(text, decimalPlaces) {
                    if (text) {
                        decimalPlaces = decimalPlaces || 0;
                        text = $filter('number')(text, decimalPlaces);

                        text = text.replace(/,/g, '');
                        text = text.replace(/\./,  ',');
                        return text;
                    }
                    return text;
                };
            }
        ])

        .filter('gpmSpecialFormat', [
            'Constant',
            'PHPJS',
            function(Constant, PHPJS) {
                var SpecialFormat = Constant.getByConstant('SpecialFormatTypes');

                function dateTimeFormat(value, separator) {
                    separator = separator || '-';
                    var temp = PHPJS.sprintf('%08X', value);
                    return PHPJS
                        // day/hour
                        .sprintf(
                            '%02d',
                            PHPJS.hexdec(PHPJS.substr(temp, 4, 2))
                        )+
                        separator+
                        // month/minute
                        PHPJS.sprintf(
                            '%02d',
                            PHPJS.hexdec(PHPJS.substr(temp, 2, 2))
                        )+
                        separator+
                        // year/second
                        PHPJS.sprintf(
                            '%02d',
                            PHPJS.hexdec(PHPJS.substr(temp, 0, 2))
                        )
                    ;
                }

                function extendedDate(value) {
                    var temp = PHPJS.sprintf('%06X', value);
                    return PHPJS
                        // day
                        .sprintf(
                            '%02d',
                            PHPJS.bindec(
                                PHPJS.substr(
                                    PHPJS.sprintf('%08b', PHPJS.hexdec(PHPJS.substr(temp,4,2))),
                                    3,
                                    5
                                )
                            )
                        )+
                        '-'+
                        // month
                        PHPJS.sprintf('%0d', PHPJS.hexdec(PHPJS.substr(temp,2,2)))+
                        '-'+
                        // year 2 digit
                        PHPJS.sprintf('%02d', PHPJS.hexdec(PHPJS.substr(temp,0,2)))
                    ;
                }

                function extendedTime(value) {
                    var temp = PHPJS.sprintf('%04X',value);

                    var timeType = '(I)';
                    if (PHPJS.substr(PHPJS.sprintf('%8b',PHPJS.hexdec(PHPJS.substr(temp,0,2))),0,1)==='1'){
                        timeType = '(V)';
                    }
                    return timeType+
                        ' '+
                        // hour
                        PHPJS.sprintf('%02d',PHPJS.bindec(PHPJS.substr(PHPJS.sprintf('%8b',PHPJS.hexdec(PHPJS.substr(temp,0,2))),3,5)))+
                        ':'+
                        // minute
                        PHPJS.sprintf('%02d',PHPJS.hexdec(PHPJS.substr(temp,2,2)))
                    ;
                }

                return function(value, specialFormatType) {
                    specialFormatType = parseInt(specialFormatType, 10);
                    if (!value || specialFormatType===SpecialFormat.NONE) {
                        return value;
                    }

                    switch(specialFormatType) {
                        case SpecialFormat.BIDIRECCIONAL_COUNTER_DATE:
                            value = dateTimeFormat(value, '-');
                            value = window.moment(value, 'DD-MM-YY').format(window.GPM.user.date_format.momentjs);
                            break;
                        case SpecialFormat.BIDIRECCIONAL_COUNTER_TIME:
                            value = dateTimeFormat(value, ':');
                            value = window.moment(value, 'HH:mm:ss').format(window.GPM.user.time_format.frontend_full);
                            break;
                        case SpecialFormat.BIDIRECCIONAL_COUNTER_DATE_EXTENDED:
                            value = extendedDate(value);
                            value = window.moment(value, 'DD-MM-YY').format(window.GPM.user.date_format.momentjs);
                            break;
                        case SpecialFormat.BIDIRECCIONAL_COUNTER_TIME_EXTENDED:
                            value = extendedTime(value);
                            value = PHPJS.substr(value, 0, 4) + window.moment(PHPJS.substr(value, 4), 'HH:mm').format(window.GPM.user.time_format.frontend);
                            break;
                        case SpecialFormat.METER_LOAD_PARAMETER:
                            value = PHPJS.sprintf('%.00d',value)+ ' ('+PHPJS.sprintf('%08b',value)+')';
                            break;
                    }

                    return value;
                };
            }
        ])


        .filter('decodeValue', [
            'Constant',
            function(Constant) {
                return function(value, code_type, code) {

                    if(!value || code_type==-1) {
                        return '';
                    }
                    var ProtocolCodeTypes = Constant.get('ProtocolCodeTypes');
                    var result = '';

                    if(code_type==ProtocolCodeTypes.BIT_DICTIONARY.constant)
                    {
                        var binari = parseInt(value).toString(2);
                        result = [];
                        for (var i = 1; i <= binari.length; i++) {
                            if (binari[binari.length-i]==1) {
                                //2^(i-1)
                                if(code[Math.pow(2,i-1)]){
                                    result.push(code[Math.pow(2,i-1)]);
                                }
                            }
                        }
                        if (result.length) {
                            result = '(<em>'+result.join(', ')+'</em>)';
                        }
                    }
                    else if (code_type==ProtocolCodeTypes.SIMPLE_TRANSLATION_TABLE.constant ||
                        code_type==ProtocolCodeTypes.TRANSLATION_TABLE.constant){

                        if (code[value]) {
                            result = '(<em>'+code[value]+'</em>)';
                        }
                    }

                    return result;
                };
            }
        ])

    ;
})();
