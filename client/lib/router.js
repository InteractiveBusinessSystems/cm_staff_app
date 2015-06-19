Router.configure({
    layoutTemplate: 'appBody',
    notFoundTemplate: 'notFound'
});

Router.map(function () {
    this.route('home', {path: '/'});
    this.route('groups');
    this.route('group', {path: '/group/:groupName'});
    this.route('listUsers', {path: '/users'});
    this.route('editUser', {path: '/user/:_id'});
    this.route('scheduleAdmin', {path: '/admin/schedule'});
    this.route("staticAdmin", {path: '/admin/static'});
    this.route("staticAdminEdit", {path: '/admin/static/:_id'});
    this.route('schedule', {path: '/schedule'});
    this.route('checkinsession', {path: '/checkin/:sessionId'});
    this.route('messages', {path: '/messages'});
    this.route('account', {path: '/account'});
});