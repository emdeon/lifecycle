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
            App.scrollEvent();
        };

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

                if(App.offset >= _.offset().top - window.innerHeight + 290 && _.is(':visible') && !_.hasClass('tweened')){

                    TweenMax.to(_, 0.5, animation);
                    _.addClass('tweened');
                }
            });
        });

        $('.flag').each(function(){

            var _ = $(this);

            events.subscribe('scroll', function(obj){

                if(_.data('offset-min') < App.offset && App.offset <= _.data('offset-max')){
                    _.addClass('affix');
                }else{
                    _.removeClass('affix');
                }
            });
        });

        $('.claim img').each(function(){

            var _ = $(this),
                $confirm = $(_.data('confirm'));

            events.subscribe('scroll', function(obj){

                if(_.data('offset-min') < App.offset && App.offset <= _.data('offset-max')){

                    if(!_.hasClass(_.parent().data('show'))){

                        _.hide();

                    } else {

                        if($confirm.length > 0){

                            if($confirm.is(':hidden')){

                                _.show();

                            }else{

                                _.hide();
                            }

                        }else{

                            _.show();
                        }
                    }

                }else{

                    _.hide();
                }
            });
        });
    },
    choose: function($handler){

        var $choice = $($handler.attr('href')),
            $claim = $('.claim');

        $handler.parent().parent().hide();

        $choice.show();

        $($handler.data('claim')).show();
        //$claim.attr('class', 'claim');
        $claim.data('show', $handler.data('claim-parent'));

        $('html, body').animate({
            scrollTop: $handler.data('offset')
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

        App.attachHandlers();
        App.scrollEvent();

        $('body > div').css('visibility', 'visible');
    }
};