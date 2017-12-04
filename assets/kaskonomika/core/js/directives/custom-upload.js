/**
 * Created by Ravy on 22.09.2017.
 */
(function() {
    'use strict';

    angular
        .module('kaskonomika')
        .directive('customUpload', [customUpload]);

    function customUpload() {
        return {
            template: function(elem, attr) {
                return '<div class="custom-upload">' +
                    '<div ng-if="vm.uploader'+attr.index+'.queue.length == 0">' +
                    '<label class="animated zoomIn">' +
                    '<input type="file" nv-file-select uploader="vm.uploader'+attr.index+'" required/>' +
                    '<span class="btn btn-primary btn-upload">'+attr.doc+'</span>' +
                    '</label>' +
                    '</div>' +
                    '<div ng-if="vm.uploader'+attr.index+'.queue.length > 0 && vm.uploader'+attr.index+'.queue[0].progress < 100">' +
                    '<uib-progressbar class="progress-striped active" type="success" value="vm.uploader'+attr.index+'.queue[0].progress"></uib-progressbar>' +
                    '</div>' +
                    '<div ng-if="vm.uploader'+attr.index+'.queue.length > 0 && vm.uploader'+attr.index+'.queue[0].progress >= 100">' +
                    '<div class="btn-group animated zoomIn">' +
                    '<a type="button" class="btn btn-success" disabled="disabled">Файл загружен</a>' +
                    '<a type="button" class="btn btn-danger" ng-click="vm.clearQueue'+attr.index+'()" uib-tooltip="Удалить">' +
                    '<i class="fa fa-trash"></i>' +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        };
    }
})();
