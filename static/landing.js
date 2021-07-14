
function aboutClick(){
    window.location.replace("http://127.0.0.1:5500/static/streaming.html");
}

$("about").click(function(){
    $("modal").toggleClass("main");
});