$(function() {
    
    function setUpLinks() {
        
        // tooltip links
        $('a[title]').each(function(){
            $(this).tooltip();
        }).click(function(e){
            e.preventDefault()
        });
        
        // internal links
        $('a:urlInternal').click(function(e) {
            e.preventDefault(); // no page reload
            $.bbq.pushState({}, 2);
        });
    }
    
    function hashchange() {
        var tabname = $.param.fragment() || 'home';
        
        var tabLinkSelector = tabname == 'home' ? 'a[href="./"]' : 'a[href="#' + tabname + '"]';
        var tabContentSelector = '.tab-' + tabname;
        
        $('.nav li').removeClass('active')
            .find(tabLinkSelector)
            .parent().addClass('active');
        
        $('.tab-content').hide().filter(tabContentSelector).show();
    }
    
    $(window).hashchange(hashchange).hashchange();
    
    setUpLinks();
    
});
