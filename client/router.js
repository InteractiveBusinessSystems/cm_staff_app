
Router.configure({
  layoutTemplate: 'appBody',
  notFoundTemplate: 'notFound'
});

Router.route('/', function () {
  this.render('MyTemplate');
});