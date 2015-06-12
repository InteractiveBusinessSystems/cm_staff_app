Template.registerHelper('formatToTime', function (dateTime) {
    return moment(dateTime).format('h:mma');
});