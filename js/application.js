$(function() {

    function setUpTabs() {

        var navLinks = $('.nav a');

        navLinks.click(function(e) {
            e.preventDefault();

            jQuery.bbq.pushState($(this).attr('href'));
        });

    }
    
    function setUpTooltips() {
        $('a[title]').each(function(){
            $(this).tooltip();
        });
    }
    
    $(window).on('hashchange', function(e) {
        $('.nav li').removeClass('active');
        $('.nav li a[href="' + window.location.hash + '"]').parent().addClass('active');
        
        // switch tabs
        var tabname = window.location.hash || '#home';
        tabname = tabname.replace(/#/,'');
        
        $('.tab-content:not(.tab-'+tabname+')').hide();
        $('.tab-content.tab-'+tabname).show();
        
        
    }).trigger('hashchange');
    
    setUpTabs();
    setUpTooltips();
    
});
