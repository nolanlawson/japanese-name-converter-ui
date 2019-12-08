document.addEventListener('DOMContentLoaded', function() {
    "use strict";

    var $ = document.querySelector.bind(document)
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

        $divInstructions.style.display = 'none'

        $divOutput.style.display = ''
        $divOutput.innerHTML = '<h4>The name' + result.q + ' in Japanese is </h4>' +
          '<h3 style="text-align: center">' +
          '<span>' + result.katakana + '</span>' +
          '<span class="muted">(' + result.roomaji + ')</span>' +
          '</h3>'
    }

    function convertName(params) {
        $ajaxLoaded.style.display = ''
        $ajaxLoading.style.display = 'none'
        if (params && params.q) {
            $ajaxLoaded.style.display = 'none'
            $ajaxLoading.style.display = ''
            $btnConvert.classList.add('disabled');
            if ($inputConvert.value !== params.q) {
                $inputConvert.value = params.q;
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
        $$('a[title]').forEach(function(){
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

        $$('.nav li').forEach(function (li) {
            li.classList.remove('active')
        })

        $$('.nav li ' + tabLinkSelector).forEach(function (link) {
            link.parentElement.classList.add('active')
        })

        $$('.tab-content').forEach(function (content) {
            content.style.display = 'none'
        })

        $$('.tabl-content' + tabContentSelector).forEach(function (content) {
            content.style.display = ''
        })

        convertName(params);
        // lazy-load the Android screenshot images
        $$(tabContentSelector + ' img[data-src]').forEach(function (el) {
            el.setAttribute('src', el.getAttribute('data-src'))
        });
    }

    window.addEventListener('hashchange', hashchange)

    setUpLinks();
    setUpConvertButton();

});
