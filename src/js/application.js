/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true */
/*global console jQuery*/
(function($) {
    
    "use strict";
    
    var serverUrl = '/api/convert';
    
    var $btnConvert = $('#btn-convert');
    var $inputConvert = $('#input-convert');
    var $divOutput = $('#div-output');
    var $divInstructions = $('#div-instructions');
    var $ajaxLoading = $('.ajax-loading');
    var $ajaxLoaded = $('.ajax-loaded');

    function trim(str) {
        return str && str.replace(/^\s+/, '').replace(/\s+$/, '');
    }
    
    function showConvertedName(result, q) {
        
        $divInstructions.hide();
        
        $divOutput.show().empty().
            append(
                $('<h4></h4>').attr('role', 'presentation').text('The name "' + trim(q) + '" in Japanese is ')).
            append(
                $('<h3></h3>').attr('role', 'presentation').css({'text-align' : 'center'}).
                append(
                    $('<span></span>').text(result.katakana)).
                append($('<span></span>').addClass('muted').text(' (' + result.roomaji +')')));
        
    }
    
    function convertName(params) {
        $ajaxLoaded.show();
        $ajaxLoading.hide();
        if (params && params.q) {
            $ajaxLoaded.hide();
            $ajaxLoading.show();
            $btnConvert.addClass('disabled');
            if ($inputConvert.val() !== params.q) {
                $inputConvert.val(params.q);
            }

            fetch(serverUrl + '?' + param(params))
              .then(function (resp) {
                  return resp.json()
              })
              .then(function (result) {
                  $ajaxLoaded.show();
                  $ajaxLoading.hide();
                  $btnConvert.removeClass('disabled');
                  if (!result.error) {
                      showConvertedName(result, params.q);
                  }
              }).catch(function () {
                console.log("failed to reach " + serverUrl);
                $ajaxLoaded.show();
                $ajaxLoading.hide();
                $btnConvert.removeClass('disabled');
            })
        } else {
            // clear the converted name
            $divOutput.hide();
            $divInstructions.show();

            $inputConvert.val(null);
            $btnConvert.addClass('disabled');
        }
    }
    
    function onFormSubmit() {
        var q = $inputConvert.val();
        
        if (q) {
            
            var hash = document.location.hash;
            hash = hash.replace(/\?[^?]*$/,'');
            hash = hash + '?' + param({q : q});
            document.location.hash = hash;
        }
    }
    
    function setUpConvertButton() {
        
        $inputConvert.keyup(function(e){
            
            var q = $(this).val();
            $btnConvert.toggleClass('disabled', !q);
            
            if(e.which === 13){
                e.preventDefault();
                onFormSubmit();
            }
            
        });
        $btnConvert.addClass('disabled').click(onFormSubmit);
    }

    var aTitle = $('a[title]');

    function setUpLinks() {
        // tooltip links
        aTitle.each(function(){
            $(this).tooltip();
        }).click(function(e){
            e.preventDefault();
        });
    }

    var navLi = $('.nav li');
    var tabContent = $('.tab-content');

    function param(obj) {
        var params = new URLSearchParams(obj);
        return params.toString()
    }

    function deparam(str) {
        var params = new URLSearchParams(str);
        var res = {};
        params.forEach(function (value, key) {
            res[key] = value;
        });
        return res;
    }

    function hashchange() {
        var fragment = location.hash.replace(/^#/, '')
        var tabname = (fragment || 'home').replace(/\?[^?]*$/,'').replace(/^\//, '') || 'home';
        
        var params = fragment && fragment.match(/\?([^?]*)$/);
        if (params) {
            params = deparam(params[1]);
        }

        var tabLinkSelector = 'a[href="#' + tabname + '"]';
        var tabContentSelector = '.tab-' + tabname;
        
        navLi.removeClass('active')
            .find(tabLinkSelector)
            .parent().addClass('active');
        
        tabContent.hide().filter(tabContentSelector).show();
        
        convertName(params);
    }

    window.addEventListener('hashchange', hashchange)
    hashchange()
    
    setUpLinks();
    setUpConvertButton();

    var navContainer = $('.navbar .container-fluid');
    var navbarButton = $('.btn-navbar');
    var nav = $('#nav');
    var matcher = window.matchMedia('(max-width: 979px)');
    var mobileSize = matcher.matches;

    // accessibility fix for tab ordering, move stuff around so tabindex ordering is right
    function setNavPlacementInDom () {
        var isFirst = navContainer[0].firstElementChild === nav[0];
        if (mobileSize && isFirst) { // move to last
            nav.remove();
            navContainer.append(nav);
        } else if (!mobileSize && !isFirst) { // move to first
            nav.remove();
            navContainer.prepend(nav);
        }
    }

    // accessibility fix for bootstrap nav button, following
    // https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
    function setAriaHiddenOnNav() {
        var isHidden = mobileSize && !nav.hasClass('in');
        nav.attr('aria-hidden', isHidden ? 'true' : 'false');
        nav.find('a').each(function (i, anchor) {
            $(anchor).attr('tabIndex', isHidden ? '-1' : '0');
        });
    }
    navbarButton.click(function () {
        var pressed = navbarButton.attr('aria-expanded');
        navbarButton.attr('aria-expanded', pressed === 'true' ? 'false' : 'true');
        setTimeout(setAriaHiddenOnNav);
    });

    matcher.addListener(function () {
        mobileSize = matcher.matches;
        setAriaHiddenOnNav();
        setNavPlacementInDom();
    });
    setAriaHiddenOnNav();
    setNavPlacementInDom();

    // asynchronously load the google font
    $('link[media="only x"]').attr('media', '');
})(jQuery);
