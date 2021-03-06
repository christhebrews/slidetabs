/**
 * slidingtabs
 * @author Chris Brousseau
 * @version 0.2
 */
(function($){
    $.fn.slidingtabs = function(config){
        var slidetab = {
            showLock: false,
            hideLock: false,
            easing: "easeInOutExpo",
            duration: 500,
            effect: 'slide',
            init: function(el, config){
                $.extend(this, config);
                this.el = el;
                this.content = this.el.children('div');
                this.initLayout();
                this.el.find('nav > *').each(function(){
                    $(this).click(slidetab.handleTabClick);
                });
            },
            initLayout: function(){
                this.content.css({position: 'relative'});
                this.content.children().hide().css({width: '100%'});

                // allow an id to be passed as optional first show
                var tab = this.content.find("#" + this.startTab);
                if(tab.length){
                    tab.show();
                } else {
                    this.content.children(':first').show();
                }
            },
            setSlideMode: function(toShow, toHide){
                this.content.children().css({position: 'absolute'});
                this.content.height(Math.max(toShow.height(), toHide.height()));
                return this;
            },
            unsetSlideMode: function(){
                this.content.children().css({position: ''}); // static
                this.content.css({height: ''}); // auto
            },
            switchTab: function(toShow){
                if(this.showLock || this.hideLock) return; // prevent multiple event firing
                var toHide = this.activeTab();

                if(toShow.attr('id') != toHide.attr('id')){
                    this.showLock = this.hideLock = true;

                    var direction = this.determineDirection(toHide, toShow);
                    this.setSlideMode(toShow, toHide);

                    toShow.show({
                        effect: this.effect,
                        easing: this.easing,
                        direction: direction.show,
                        duration: this.duration,
                        complete: function(){
                            slidetab.showLock = false;
                            slidetab.unsetSlideMode();
                        }
                    });
                    toHide.hide({
                        effect: this.effect,
                        easing: this.easing,
                        direction: direction.hide,
                        duration: this.duration,
                        complete: function(){
                            slidetab.hideLock = false;
                        }
                    });
                }
            },
            determineDirection: function(hideEl, showEl){
                if(hideEl.nextAll("#" + showEl.attr('id')).length){
                    return {hide: 'left', show: 'right'}
                } else {
                    return {hide: 'right', show: 'left'}
                }
            },
            /**
             * get the currently visible content page
             */
            activeTab: function(){
                return this.content.children(':visible');
            },
            /**
             * Tab click callback
             */
            handleTabClick: function(e){
                e.preventDefault();
                slidetab.switchTab(slidetab.content.children('#' + $(this).attr('data-tab')));
            }
        }
        slidetab.init(this, config);
    }
}(jQuery));
