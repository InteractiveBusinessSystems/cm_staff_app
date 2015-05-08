Router.configure({
    layoutTemplate: 'appBody',
    notFoundTemplate: 'notFound'
});

Router.map(function () {
    this.route('home', {path: '/'});
    this.route('groups');
    this.route('group', {path: '/group/:groupName'});
    this.route('listUsers')
});