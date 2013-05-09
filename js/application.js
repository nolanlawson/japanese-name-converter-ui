/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true */
/*global console jQuery*/
(function($) {
    
    "use strict";
    
    var serverUrl = 'http://localhost:8080/jnameconverter/convert';
    
    function convertName(params) {
        if (params && params.q) {
            $.ajax({
                url      : serverUrl,
                dataType : 'json',
                data     : params
                
            }).
            done(function(result){
                window.alert(JSON.stringify(result));
            }).
            fail(function() {
                console.log("failed to reach " + serverUrl);
            });
        }
    }
    
    function setUpConvertButton() {
        $('#btn-convert').click(function(){
            
            // ask server to convert
            var q = $('#input-convert').val();
            
            if (q) {
                
                var hash = document.location.hash;
                hash = hash.replace(/\?[^?]*$/,'');
                hash = hash + '?' + $.param({q : q});
                document.location.hash = hash;
            }
            
        });
    }
    
    function setUpLinks() {
        
        // tooltip links
        $('a[title]').each(function(){
            $(this).tooltip();
        }).click(function(e){
            e.preventDefault();
        });
        
        // internal links
        $('a:urlInternal').click(function(e) {
            e.preventDefault(); // no page reload
            $.bbq.pushState({}, 2);
        });
    }
    
    function hashchange() {
        var tabname = ($.param.fragment() || 'home').replace(/\?[^?]*$/,'') || 'home';
        
        var params = $.param.fragment() && $.param.fragment().match(/\?([^?]*)$/);
        if (params) {
            params = $.deparam(params[1]);
        }
        
        
        var tabLinkSelector = 'a[href="#' + tabname + '"]';
        var tabContentSelector = '.tab-' + tabname;
        
        $('.nav li').removeClass('active')
            .find(tabLinkSelector)
            .parent().addClass('active');
        
        $('.tab-content').hide().filter(tabContentSelector).show();
        
        if (params) {
            convertName(params);
        }
        
    }
    
    $(window).hashchange(hashchange).hashchange();
    
    setUpLinks();
    setUpConvertButton();
    
})(jQuery);
