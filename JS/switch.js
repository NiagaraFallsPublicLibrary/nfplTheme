$(document).ready(function(){
    $("ul.nav li a").click(function(e){ 
        e.preventDefault();
        var url = $(this).attr('href'); //get the link you want to load data from
        $.ajax({ 
         type: 'GET',
         url: url,
         success: function(data) { 
            $("#main_page").html(data); 
        } 
       }); 
     });
  });