//load settings
var settings = JSON.parse('{' + $("settings")[0].innerHTML
    .replace(/<!--.+?-->/gms,"")
    .trim()
    .split("\n")
    .map(x => x.trim().replace(/(.+)=(.+)/, '"$1":"$2"'))
    .join(",") + '}');

ComfyJS.Init(settings.USERNAME);

if (settings.DISPLAYORDER == "bottom") {

}

ComfyJS.onChat = (user, message, flags, self, extra) => {
    var dom = $($("#message-template")[0].content.childNodes[1]).clone();
    $(".message-container", dom).attr('id', extra.id);
    $(".user", dom).text(user);
    $(".message", dom).text(message);
    
    $("#chat").append($(dom));

    var mbSides = $(".message-box .message-left, .message-box .message-right", dom);
    var message = $(".message-box .message", dom);

    var h1 = Math.round(message[0].offsetHeight / 2);
    var h2 = message[0].offsetHeight - h1;
    
    $(".message-box", dom).height(message[0].offsetHeight);
    $(dom).height(message[0].offsetHeight - 90 + 132);
    //message[0].offsetHeight - 90 + 132


    mbSides.css("border-top", `${h1}px solid transparent`);
    mbSides.css("border-bottom", `${h2}px solid transparent`);

    $(".chevron", dom).css("height", h1 - 7);
    var rad = Math.atan2(38, h1 - 7);
    var deg = 180 * rad / Math.PI;
    
    $(".chevron-top.chevron-left, .chevron-bottom.chevron-right", dom)
        .css("transform", `skew(${-deg}deg)`);
    $(".chevron-top.chevron-right, .chevron-bottom.chevron-left", dom)
        .css("transform", `skew(${deg}deg)`);
}