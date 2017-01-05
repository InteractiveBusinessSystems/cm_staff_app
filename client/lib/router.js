Router.configure({
    layoutTemplate: 'appBody',
    notFoundTemplate: 'notFound'
});

Router.map(function () {
    this.route('schedule', {path: '/'});
    this.route('home', {path: '/dashboard'});
    this.route('groups');
    this.route('group', {path: '/group/:groupName'});
    this.route('listUsers', {path: '/users'});
    this.route('editUser', {path: '/user/:_id'});
    this.route('scheduleAdmin', {path: '/admin/schedule'});
    this.route("staticAdmin", {path: '/admin/static'});
    this.route("staticAdminEdit", {path: '/admin/static/:_id'});
    this.route("adminHelpers", {path: '/admin/helpers'});

    this.route('checkinsession', {path: '/checkin/:sessionId'});
    this.route('messages', {path: '/messages'});
    this.route('sendmessages', {path: '/messages/sendmessages'});
    this.route('account', {path: '/account'});
    this.route('exportsessiondata', {path: '/exportsessiondata'});
    this.route('allschedules', {path: '/allschedules'});
    this.route('allschedulesvol', {path: '/allschedulesvol'});

    this.route('responsibilities', {path: '/responsibilities'});
    this.route('map', {path: '/map'});
});