//load settings
var settings = JSON.parse('{' + $("settings")[0].innerHTML
    .replace(/<!--.+?-->/gms,"")
    .trim()
    .split("\n")
    .map(x => x.trim().replace(/(.+)=(.+)/, '"$1":"$2"'))
    .join(",") + '}');

//common code
function tryParseInt(int, def) {
    let parsed = parseInt(int);
    if (isNaN(parsed)) return def;
    return parsed;
}

ComfyJS.Init(settings.USERNAME);
var opacity = tryParseInt(settings.OPACITY, 100) / 100;

var displayBottom = settings.NEW_MESSAGE_POSITION.toLowerCase() == "bottom";
if (displayBottom)
    $("#chat").css("bottom", 0);

var removeMessagesTime = tryParseInt(settings.REMOVE_MESSAGE_AFTER_TIME, 0);

ComfyJS.onChat = (user, message, flags, self, extra) => {
    var dom = $($("#message-template")[0].content.childNodes[1]).clone();
    $(".message-container", dom).attr('id', extra.id);
    $(".user", dom).text(user);
    $(".message", dom).text(message);
    if (displayBottom) {
        $("#chat").append($(dom));
    } else {
        $("#chat").prepend($(dom));
    }

    if (removeMessagesTime != 0) {
        setTimeout(function() {
            $(dom).css("transition", "visibility 0s 2s, opacity 1s linear");
            $(dom).css("opacity", 0);
            $(dom).css("visibility", "hidden");
        }, removeMessagesTime * 1000);
        setTimeout(function() {
            $(dom).remove();
        }, (2 + removeMessagesTime) * 1000);
    }
    

    var mbSides = $(".message-box .message-left, .message-box .message-right", dom);
    var message = $(".message-box .message", dom);

    var h1 = Math.round(message[0].offsetHeight / 2);
    var h2 = message[0].offsetHeight - h1;
    
    $(".message-box", dom).height(message[0].offsetHeight);
    $(dom).height(message[0].offsetHeight - 90 + 132);

    mbSides.css("border-top", `${h1}px solid transparent`);
    mbSides.css("border-bottom", `${h2}px solid transparent`);

    $(".chevron", dom).css("height", h1 - 7);
    var rad = Math.atan2(38, h1 - 7);
    var deg = 180 * rad / Math.PI;
    
    $(".chevron-top.chevron-left, .chevron-bottom.chevron-right", dom)
        .css("transform", `skew(${-deg}deg)`);
    $(".chevron-top.chevron-right, .chevron-bottom.chevron-left", dom)
        .css("transform", `skew(${deg}deg)`);

    if (opacity != 1) {
        var color = `rgba(24, 24, 24, ${opacity})`;
        $(".message-box .message, .user-box .buffer", dom).css("background-color", color);
        $(".user-box .left, .message-box .message-left", dom).css("border-right-color", color);
        $(".user-box .right, .message-box .message-right", dom).css("border-left-color", color);
        $(".user-box .user", dom).css("border-top-color", color);
        $(".user-box .user", dom).css("border-bottom-color", color);
    }
}