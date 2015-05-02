Template.registerHelper("arrayJoin", function (arr) {
    if (arr == null)
        return "No Group";
    else
        return arr.join(",");
});