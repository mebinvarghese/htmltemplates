/*
 * vBook - Flip Book vCard Resume Template
 * Author: jjworks
 * Author URL: https://themeforest.net/user/jjworks
 */

(function () {
    'use strict';

    /** Detecting viewpot dimension */
    var vW = $(window).width();
    var vH = $(window).height();
    var bH = $('.bb-bigbook-wrapper').height();
    var $wCntnr = $('.works-container');

    /** Window Load */
    $(window).on('load', function () {

        /** Loader */
        $('.loader-wrapper').fadeOut('slow');

    });

    var Page = (function () {
        var bbDir;
        if ($("html").attr("dir") == "rtl") {
            bbDir = 'rtl';
        } else {
            bbDir = 'ltr';
        }

        var current_page = 0;

        var config = {
            $bookBlock: $('.bb-bookblock'),
            $nav: $('.site-nav > .main-nav > li'),
            $navNext: $('.bb-nav-next'),
            $navPrev: $('.bb-nav-prev'),
            $navFirst: $('#bb-nav-first'),
            $navLast: $('#bb-nav-last'),
            $nextArrow: $('#nextslide'),
            $nextArrow1: $('#nextslide1'),
            $prevArrow: $('#prevslide'),
            $prevArrow1: $('#prevslide1'),
        },
            init = function () {
                config.$bookBlock.bookblock({
                    direction: bbDir,
                    speed: 1000,
                    shadowSides: 0.8,
                    shadowFlip: 0.4,
                    onEndFlip: function (old, page, isLimit) {
                        current_page = page;

                        // initPortfolio
                        $('.bb-item').eq(page).find('.works-container').trigger({ type: 'initWorks', test: true, name: 'initWorks' });
                    }
                });
                initEvents();
            },
            initEvents = function () {

                var $slides = config.$bookBlock.children();

                // add navigation events
                config.$nav.on('click touchstart', function () {
                    var i = $(this).index();
                    console.log(i)
                    if (i == 0) {
                        config.$bookBlock.bookblock('next');
                    } else if (i == 4) {
                        config.$bookBlock.bookblock('prev');
                    } else {
                        config.$bookBlock.bookblock('jump', i);
                    }
                    return false;
                });

                config.$navNext.on('click touchstart', function () {
                    config.$bookBlock.bookblock('next');
                    return false;
                });

                config.$navPrev.on('click touchstart', function () {
                    config.$bookBlock.bookblock('prev');
                    return false;
                });

                config.$navFirst.on('click touchstart', function () {
                    config.$bookBlock.bookblock('first');
                    return false;
                });

                config.$navLast.on('click touchstart', function () {
                    config.$bookBlock.bookblock('last');
                    return false;
                });
                config.$nextArrow.on('click touchstart', function () {
                    config.$bookBlock.bookblock('next');
                    return false;
                });
                config.$nextArrow1.on('click touchstart', function () {
                    config.$bookBlock.bookblock('next');
                    return false;
                });
                config.$prevArrow.on('click touchstart', function () {
                    config.$bookBlock.bookblock('prev');
                    return false;
                });
                config.$prevArrow1.on('click touchstart', function () {
                    config.$bookBlock.bookblock('prev');
                    return false;
                });

                // add swipe events
                $slides.on({
                    'swipeleft': function (event) {
                        config.$bookBlock.bookblock('next');
                        return false;
                    },
                    'swiperight': function (event) {
                        config.$bookBlock.bookblock('prev');
                        return false;
                    }
                });

                // add keyboard events
                $(document).keydown(function (e) {
                    var keyCode = e.keyCode || e.which,
                        arrow = {
                            left: 37,
                            up: 38,
                            right: 39,
                            down: 40
                        };

                    switch (keyCode) {
                        case arrow.left:
                            config.$bookBlock.bookblock('prev');
                            break;
                        case arrow.right:
                            config.$bookBlock.bookblock('next');
                            break;
                    }
                });
            };

        $wCntnr.one('initWorks', function () {
            initPortfolio();
        });

        return {
            init: init
        };

    })();

    if ($(window).width() > 991) {
        Page.init();
    }

    /** Animation on scroll */
    function elementInView() {
        var $animatedElements = $(".anim");
        var $window = $(window);

        $window.on('scroll resize', function () {
            var windowHeight = $window.height();
            var windowTopPosition = $window.scrollTop();
            var windowBottPosition = (windowTopPosition + windowHeight);

            $.each($animatedElements, function () {
                var $element = $(this);
                var elementHeight = $element.outerHeight();
                var elementTopPosition = $element.offset().top;
                var elementBottPosition = (elementTopPosition + elementHeight);

                //Check to see if this current container is within viewport
                if ((elementBottPosition >= windowTopPosition) &&
                    (elementTopPosition <= windowBottPosition)) {
                    $element.addClass('animated');
                    //$element.removeClass('anim');

                    //Animate progress bar
                    if ($element.hasClass('progress-bar')) {
                        $element.css('width', $element.attr('data-percent') + '%');
                    }

                }
                //else {
                //$element.removeClass('animated');
                //}
            });
        });

        $window.trigger('scroll');

    }

    /** Init Portfolio */
    function initPortfolio() {
        //checking if all images are loaded
        $wCntnr.imagesLoaded(function () {

            //init isotope once all images are loaded
            $wCntnr.isotope({
                // options
                itemSelector: '.works-item',
                layoutMode: 'masonry',
                transitionDuration: '0.8s'
            });

            //forcing a perfect masonry layout after initial load
            $wCntnr.isotope('layout');

            //triggering filtering
            $('.works-filter li a').on('click', function () {
                $('.works-filter li a').removeClass('active');
                $(this).addClass('active');

                var selector = $(this).attr('data-filter');
                $('.works-container').isotope({
                    filter: selector
                });
                setTimeout(function () {
                    $wCntnr.isotope('layout');
                }, 10);
                return false;
            });

            //Isotope ReLayout on Window Resize event.
            $(window).on('resize', function () {
                $wCntnr.isotope('layout');
            });

            //Isotope ReLayout on device orientation changes
            window.addEventListener("orientationchange", function () {
                $wCntnr.isotope('layout');
            }, false);

        });
    }

    $(document).ready(function () {

        elementInView();

        /** Background Image */
        $('.bg-image').each(function () {
            var $imgPath = $(this).attr('data-image');
            $(this).css('background-image', 'url(' + $imgPath + ')');
        });

        if ($(window).width() > 991) {
            $('.bb-custom-side-content').slimScroll({
                height: bH + 'px'
            });
            $('.bb-custom-side').each(function () {
                $(this).append('<div class="bb-custom-side-space-top"></div><div class="bb-custom-side-space-bottom"></div>')
            });

            /** Open Book */
            $('.book-opener, .bb-nav-close').on('click', function (e) {
                e.preventDefault();
                $('body').toggleClass('book-open');
                $('.scroll-wrap').toggleClass('hide-overflow');
                $('.bb-bigbook').toggleClass('show');
                $('.smallbook').toggleClass('opened');
            });
            $('.bb-nav-close').on('click', function (e) {
                e.preventDefault();
                $('.smallbook').removeClass('opened');
                $('.smallbook').addClass('closed');
                $('.bb-bigbook').removeClass('show');
                $('.bb-bigbook').addClass('hide');
                setTimeout(function () {
                    $('.smallbook').removeClass('closed');
                    $('.bb-bigbook').removeClass('hide');
                }, 500);
            });
        }


        if ($(window).width() < 992) {
            /** Site Navigation LocalScroll */
            $('.site-nav ul').localScroll({
                target: 'body',
                offset: -50,
                queue: true,
                duration: 1000,
                hash: false,
            });
            initPortfolio();
        }

        /** MagnificPopup For Portfolio */
        $('a.lightbox').magnificPopup({
            type: 'image',
        });

        $('a.lightbox-inline').magnificPopup({
            type: 'inline',
            mainClass: 'works-modal-container',
            callbacks: {
                open: function () {
                    $('.works-modal').slimScroll({
                        height: vH + 'px'
                    });
                }
            }
        });

        $('a.lightbox-iframe').magnificPopup({
            type: 'iframe',
            iframe: {
                markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' + '</div>',

                patterns: {
                    youtube: {
                        index: 'youtube.com/',
                        id: 'v=',
                        src: 'http://www.youtube.com/embed/%id%?autoplay=1'
                    },
                    vimeo: {
                        index: 'vimeo.com/',
                        id: '/',
                        src: '//player.vimeo.com/video/%id%?autoplay=1'
                    },
                    gmaps: {
                        index: '//maps.google.',
                        src: '%id%&output=embed'
                    }
                },

                srcAction: 'iframe_src',
            }
        });

        // styleswitch [for demonstration purposes only]
        $(".customizer-toggler").on("click", function () {
            $(".customizer").toggleClass("active");
        });
        function swapStyleSheet(sheet) {
            document.getElementById("general-css").setAttribute("href", sheet);
        }

    });

    /** Contact Form */
    $('.contact-form').on('submit', function (e) {
        e.preventDefault();
        var name = $('#name').val();
        var email = $('#email').val();
        var subject = 'Contact form submitted by ' + name;
        var message = $('#message').val();
        var dataString = 'name=' + name + '&email=' + email + '&subject=' + subject + '&message=' + message;

        function isValidEmail(emailAddress) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        };

        if (isValidEmail(email) && (message.length > 1) && (name.length > 1)) {
            $.ajax({
                type: 'POST',
                url: 'php/contact.php',
                data: dataString,
                success: function () {
                    $('.success').fadeIn(1000);
                    $('.error').fadeOut(500);
                }
            });
        } else {
            $('.error').fadeIn(1000);
            $('.success').fadeOut(500);
        }

        return false;
    });

})();