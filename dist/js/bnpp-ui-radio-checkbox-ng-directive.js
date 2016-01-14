angular.module('app', [])
    .directive('radio', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: function (tElement, tAttrs) {
            var moreClass = tAttrs.class ? ' ' + tAttrs.class : '';
            return '<label ng-transclude><input type="radio" ng-model="' + tAttrs.model
            + '" value="' + tAttrs.value + '"><div class="custom-radio' + moreClass + '"></div>';
        }
    };
});
angular.module('app', []).directive('checkbox', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: function (tElement, tAttrs) {
            var customTrue = tAttrs.true ? ' ng-true-value="' + tAttrs.true + '"' : '';
            var customFalse = tAttrs.false ? ' ng-false-value="' + tAttrs.false + '"' : '';
            var moreClass = tAttrs.class ? ' ' + tAttrs.class : '';
            return '<label ng-transclude><input type="checkbox" ng-model="' + tAttrs.model + '"' + customTrue + customFalse
            + '><div class="custom-checkbox' + moreClass + '"></div>';
        }
    };
});