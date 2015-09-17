var events = (function(){

    var topics = {};
    var hOP = topics.hasOwnProperty;

    return {
        subscribe: function(topic, listener) {
            if(!hOP.call(topics, topic)) topics[topic] = [];
            var index = topics[topic].push(listener) -1;
            return {
                remove: function() {
                    delete topics[topic][index];
                }
            };
        },
        publish: function(topic, info) {
            if(!hOP.call(topics, topic)) return;
            topics[topic].forEach(function(item) {
                item(info != undefined ? info : {});
            });
        }
    };
})();

var App = {
    attachHandlers: function(){

        document.onscroll = function(){

            var $down = $('.down');

            TweenMax.killTweensOf($down);
            $down.fadeOut();

            App.scrollEvent();
        };

        $('.down').click(function(e){

            e.preventDefault();

            var $hospital = $('.hospital');

            $(this).fadeOut(300);

            $('html, body').animate({
                scrollTop: $hospital.offset().top - 378
            }, 1000);
        });

        $('.marker').click(function(e){
            e.preventDefault();
            App.showMarker($(this).attr('href'), $(this));
        });

        $('.choose').click(function(e){
            e.preventDefault();
            App.choose($(this));
        });

        $('[data-animation]').each(function(){

            var _ = $(this),
                animation = {};

            _.data('animation-right') ? animation.right = _.data('animation') : animation.left = _.data('animation');

            events.subscribe('scroll', function(obj){

                if(App.offset >= _.offset().top - (window.innerHeight * .75) + 290 && _.is(':visible') && !_.hasClass('tweened')){

                    TweenMax.to(_, 0.5, animation);
                    _.addClass('tweened');
                }
            });
        });

        $('.flag').each(function(){

            var _ = $(this);

            events.subscribe('scroll', function(obj){

                var top = _.offset().top;

                if(_.is(':visible') && !_.hasClass('affix')){
                    _.data('offset', top);
                }

                var affix = $('.flag1').offset().top;

                if(_.is(':visible') && top < affix){
                    _.addClass('affix');
                }

                if(_.data('offset') > affix){
                    _.removeClass('affix');
                }
            });
        });

        $('.claim img').each(function(){

            var _ = $(this),
                $confirm = $(_.data('confirm')),
                claim = _.data('claim-reveal') ? _.data('claim-reveal').split('|') : null;

            events.subscribe('scroll', function(obj){

                if(claim){

                    claimIn = $(claim[0]).offset().top + parseInt(claim[1]),
                    claimOut = $(claim[2]).offset().top + parseInt(claim[3]);

                    if(claimIn < App.offset && App.offset <= claimOut){

                        if(!_.hasClass(_.parent().data('show'))){

                            _.hide();

                        } else {

                            if($confirm.length > 0){

                                if($confirm.is(':hidden')){

                                    _.show();

                                } else {

                                    _.hide();
                                }

                            } else {

                                _.show();
                            }
                        }

                    } else {

                        _.hide();
                    }
                }
            });
        });
    },
    choose: function($handler){

        var $choice = $($handler.attr('href')),
            $claim = $('.claim'),
            $offset = $($handler.data('offset'));

        $handler.parent().parent().hide();

        $choice.show();

        $($handler.data('claim')).show();

        $claim.data('show', $handler.data('claim-parent'));

        $('html, body').animate({
            scrollTop: $offset.offset().top - 378
        }, 700);
    },
    offset: 0,
    scrollEvent: function(){

        App.offset = $('.claim').offset().top;
        events.publish('scroll');
    },
    showMarker: function(el, $handler){

        var $el = $(el),
            $plus = $handler.find('span');

        if($el.is(':hidden')){

            $el.fadeIn(100);
            TweenMax.to( $plus, 0.1, { css: { rotation: 45, left:'1px' } });

        } else {

            $el.fadeOut(100);
            TweenMax.to( $plus, 0.1, { css: { rotation: 0, left:'0' } });
        }
    },
    start: function(){

        events.subscribe('scroll', function(obj) {

            $('.claim-position').html('Claim: ' + App.offset);
        });

        App.yoyo();
        App.attachHandlers();
        App.scrollEvent();

        $('body > div').css('visibility', 'visible');
    },
    yoyo: function(){

        if($(window).scrollTop() > 0){
            $('.down').hide();
        }

        TweenMax.to('.down', 0.5, { css: { bottom: '8px' } }).repeat(-1).yoyo(true);
    }
};