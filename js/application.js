document.addEventListener('DOMContentLoaded', function() {
    "use strict";

    var $ = document.querySelector.bind($)
    var $$ = function (selector) {
        return Array.prototype.slice.apply(document.querySelectorAll(selector))
    }

    function fragment () {
        return location.hash.replace(/^#/).replace(/^\?/, '')
    }

    function deparam (str) {
        var res = {}
        return new URLSearchParams('?' + str).forEach(function (value, key) {
            res[key] = value
        })
        return res
    }

    var serverUrl = '/jnameconverter-server/convert';

    var $btnConvert = $('#btn-convert');
    var $inputConvert = $('#input-convert');
    var $divOutput = $('#div-output');
    var $divInstructions = $('#div-instructions');
    var $ajaxLoading = $('.ajax-loading');
    var $ajaxLoaded = $('.ajax-loaded');

    function showConvertedName(result) {

        $divInstructions.hide();

        $divOutput.show().empty().
            append(
                $('<h4></h4>').text('The name "' + result.q + '" in Japanese is ')).
            append(
                $('<h3></h3>').css({'text-align' : 'center'}).
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

            fetch(serverUrl + new URLSearchParams(params).toString())
              .then(function (response) {
                  return response.json()
              }).then(function (result) {
                $ajaxLoaded.show();
                $ajaxLoading.hide();
                $btnConvert.removeClass('disabled');
                if (!result.error) {
                    showConvertedName(result);
                }
            }).catch(function () {
                console.log("failed to reach " + serverUrl);
                $ajaxLoaded.show();
                $ajaxLoading.hide();
                $btnConvert.removeClass('disabled');
            });
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
            hash = hash + new URLSearchParams({q : q}).toString();
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

    function setUpLinks() {

        // tooltip links
        $('a[title]').each(function(){
            $(this).tooltip();
        }).click(function(e){
            e.preventDefault();
        });

        // internal links

        $$('a').forEach(function (a) {
            if (new URL(a.href, location.href).origin === location.origin) {
                a.addEventListener('click', function (e) {
                    e.preventDefault(); // no page reload
                    window.History.pushState()
                })
            }
        })
    }

    function hashchange() {
        var tabname = (fragment() || 'home').replace(/\?[^?]*$/,'') || 'home';

        var params = fragment() && fragment().match(/\?([^?]*)$/);
        if (params) {
            params = deparam(params[1]);
        }


        var tabLinkSelector = 'a[href="#' + tabname + '"]';
        var tabContentSelector = '.tab-' + tabname;

        $('.nav li').classList.remove('active')
            .find(tabLinkSelector)
            .parent().addClass('active');

        $('.tab-content').hide().filter(tabContentSelector).show();

        convertName(params);
        // lazy-load the Android screenshot images
        $(tabContentSelector).find('img[data-src]').each(function (i, el) {
            $(el).attr('src', $(el).attr('data-src'));
        });
    }

    $(window).hashchange(hashchange).hashchange();

    setUpLinks();
    setUpConvertButton();

});
