// components/taskItem.component.js
//
// A "leaf" component: it has no AngularJS children and talks to its
// parent only through bindings (<, &). This is the textbook first
// candidate for upgrade/downgrade during hybrid migration — you can
// rewrite it as an Angular @Component and register it with
// downgradeComponent() without touching anything else in the tree.
angular.module('taskApp').component('taskItem', {
  bindings: {
    task: '<',
    onToggle: '&',
    onRemove: '&'
  },
  template:
    '<div class="task-item" ng-class="{done: $ctrl.task.done}">' +
    '  <input type="checkbox" ng-checked="$ctrl.task.done" ng-click="$ctrl.onToggle()" />' +
    '  <span class="title">{{ $ctrl.task.title }}</span>' +
    '  <button class="remove" ng-click="$ctrl.onRemove()">&times;</button>' +
    '</div>'
});
