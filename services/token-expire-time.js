exports.tokenExpireTime = function (expTime) {
    var currentDateTime = new Date();

    var diff_in_mins = expTime.getMinutes() - currentDateTime.getMinutes();
    var diff_in_hours = expTime.getHours() - currentDateTime.getHours();
    
    var diff_in_secs = expTime.getSeconds() - currentDateTime.getSeconds();
   
    return `${diff_in_hours}: hours ${diff_in_mins}: min ${diff_in_secs}: sec`;
};
