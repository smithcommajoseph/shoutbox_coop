Drupal.behaviors.shoutbox_coop = function(context) {
    
    //Not the prettiest way to reload all the shouts, but it does the trick.
    var shoutboxReload = function(forceReload){        
        var  uri = location.href.split('/'),
        group = uri[3],
        firstPager = $('.pager ul.links.pager li')[0];
        
        forceReload = forceReload || false;
        
        if($(firstPager).hasClass('pager-current') || forceReload === true){
            $.getJSON('/'+group+'/shoutbox/reload', function(data){
                $('.shoutbox-list').empty().append(data.data);

                //this is compensating for an Atrium bug where the 'delete' link will set the destination
                //as the url that generated the content
                $.each($('.views-field.delete a'), function(){
                    var href = $(this).attr('href'),
                    preChopIdx = href.indexOf('='),
                    preChopStr = href.substr(0,preChopIdx),
                    modHref = preChopStr+"=shoutbox";
                    $(this).attr('href', modHref);
                });
                
                $.each($('.pager ul.links.pager li a'), function(){
                    var href = $(this).attr('href'),
                    modHref = href.replace('reload', '');
                    $(this).attr('href', modHref);
                });
                
            });
            
        }
    },
    
    keybindHandler = function(e){
        if(e.which == 13 && $('#edit-shout').val().length > 0) {
            $('#edit-shout').unbind('keypress.shoutbox_coop');
                        
            e.preventDefault();

            var $form = $('#atrium-shoutbox-shoutform'),
            url = $form.attr('action'),
            inputs = [];
            
            $.each($form.find('input[type!=submit], textarea'), function(k,v){
                inputs[k] = $(this).attr('name')+"="+$(this).val();
            });
            
            $.ajax({
                type: 'POST',
                url: url,
                data: inputs.join("&"),
                success: function(data){
                    $('#edit-shout').val('');
                    $('#edit-shout').bind('keypress.shoutbox_coop', keybindHandler);
                    shoutboxReload(true);
                    
                }
            });
        }
    };
    
    if($('body').hasClass('page-shoutbox')){
        setInterval(shoutboxReload, 10000);
        
        //block our submits
        $('#atrium-shoutbox-shoutform').bind('submit.shoutbox_coop', function(e){
            return false;
        });
        
        //Enter/Return should submit the page
        $('#edit-shout').bind('keypress.shoutbox_coop', keybindHandler);
        
    }
    
};