(function () {

    'use strict';

    /**
     * @ngdoc service
     * @name angularReactTableRenderingApp.Constant
     * @description
     * # Constant
     * Service in the angularReactTableRenderingApp.
     */
    angular.module('angularReactTableRenderingApp')
        .service('Constant', function() {
            return {
                /**
                 * Returns constant values
                 * @param  {string} constantClassName
                 * @return {Object}
                 *     {
                 *         'NUMBER_COMMA': {
                 *             'constant': 1,
                 *             'name': '10000,00'
                 *             [...] // Other properties defined in constant
                 *         },
                 *     }
                 */
                get: function(constantClassName) {
                    if (!window.GPM[constantClassName]) {
                        throw 'La constante ['+constantClassName+'] no está definida.';
                    }
                    return angular.copy(window.GPM[constantClassName]);
                },
                /**
                 * Returns constant in array
                 * @param  {string} constantClassName
                 * @return {Object}
                 *     [
                 *         {
                 *             'constant':1,
                 *             'name':'10000,00'
                 *             [...] // Other properties defined in constant
                 *         }
                 *     ]
                 */
                getArray: function(constantClassName) {
                    var parsedConstant = [];
                    angular.forEach(this.get(constantClassName), function(value){
                        parsedConstant.push(value);
                    });
                    return parsedConstant;
                },
                /**
                 * Returns for use in comparisions
                 * @param  {string} constantClassName
                 * @return {Object}
                 *     {
                 *         'NUMBER_COMMA':1,
                 *         'NUMBER_POINT':2,
                 *         'NUMBER_COMMA_POINT':3,
                 *         'NUMBER_POINT_COMMA':4
                 *     }
                 */
                getByConstant: function(constantClassName) {
                    var parsedConstant = {};
                    angular.forEach(this.get(constantClassName), function(value, key){
                        parsedConstant[key] = value.constant;
                    });
                    return parsedConstant;
                },
                /**
                 * Returns all structure references by constant
                 * @param  {string} constantClassName
                 * @return {Object}
                 *     {
                 *         '1':{
                 *             'constant':1,
                 *             'name':'10000,00'
                 *             [...] // Other properties defined in constant
                 *         },
                 *         '2':{
                 *             'constant':2,
                 *             'name':'10000.00'
                 *             [...] // Other properties defined in constant
                 *         }
                 *     }
                 */
                getAllByKey: function(constantClassName) {
                    var parsedConstant = {};
                    angular.forEach(this.get(constantClassName), function(value){
                        parsedConstant[value.constant] = value;
                    });
                    return parsedConstant;
                },
                /**
                 * Returns constant values
                 * @param  {string} constantClassName
                 * @return {Object}
                 *     {
                 *         '1':'10000,00',
                 *         '2':'10000.00',
                 *         '3':'10,000.00',
                 *         '4':'10.000,00'
                 *     }
                 */
                getByKey: function(constantClassName) {
                    var parsedConstant = {};
                    angular.forEach(this.get(constantClassName), function(value){
                        parsedConstant[value.constant] = value.name;
                    });
                    return parsedConstant;
                },
                /**
                 * Returns constant values for RoleTypes implementation (constantValue defined in other constant properties)
                 * @param  {string} constantClassName
                 * @return {Object}
                 *     {
                 *         '1':'Role 1 (User)',
                 *         '2':'Role 2 (Technician)',
                 *         '3':'Role 3 (Client Manager)',
                 *         '8':'Role 8 (GPM KAM)',
                 *         '9':'Role 9 (GPM)',
                 *         '10':'Rol-10 (Admin)'
                 *     }
                 */
                getByKeyValue: function(constantClassName) {
                    var parsedConstant = {};
                    angular.forEach(this.get(constantClassName), function(value){
                        parsedConstant[value.constantValue] = value.name;
                    });
                    return parsedConstant;
                },
                /**
                 * Returns constant to use with lists (gpmselect)
                 * @param  {string} constantClassName
                 * @return {Object}
                 *     [
                 *         {
                 *             'name':'10000,00',
                 *             'value':1
                 *         },
                 *     ]
                 */
                parse: function(constantClassName) {
                    var parsedConstant = [];

                    angular.forEach(this.get(constantClassName), function(value) {
                        if (isNumeric(value.constant)) {
                            value.constant = parseInt(value.constant, 10);
                        }
                        parsedConstant.push({
                            name: value.name,
                            value: value.constant
                        });
                    });

                    function isNumeric(n) {
                        return !isNaN(parseFloat(n)) && isFinite(n);
                    }
                    return parsedConstant;
                },
            };
        }
    );
})();

