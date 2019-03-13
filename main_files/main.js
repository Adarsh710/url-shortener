$(document).ready(function(){
    $("#submit").click(function(){
      url = $(".url-input").val();
      $.post("/shorten",{url: url},function(data){
        // alert("The url is sent to backend which is: "+data);
        var shurl = window.location.origin +"/"+ data.hash;
        $(".url-input").val(shurl);
      });
    });
    $("#Send").click(function(){
        name = $("#name").val();
        email = $("#email").val();
        comment = $("#comments").val();
        $.post("/contact",{name:name,email:email,comment:comment},function(data){
        });
        alert("We'll get back to you within 24 hours.");
    });
});
