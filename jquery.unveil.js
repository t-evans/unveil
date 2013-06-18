/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {
  var defaults = {
    threshold: 0,
    $preLoadContent: null, // A jQuery object that will be shown in place of the img, while it is waiting for the img to load
    $preLoadWrapper: null, // A jQuery object that the initial image should be placed in while waiting
    $postLoadWrapper: null, // A jQuery object that the final image should be placed in
    hideOnTransition: true, // By default, it will hide & fade in the new image. Override this and onLoad if you would like to change that.
    onLoad: function($img) {
        $img.fadeIn();
    }
  };
  $.fn.unveil = function(opts) {

    var opts = $.extend(defaults, opts),
        $w = $(window),
        th = opts.threshold,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        onLoad = opts.onLoad,
        loaded,
        inview,
        source;

    this.one("unveil", function() {
      var $img = $(this);

      if (opts.$preLoadContent) {
        $img.hide();
        $img.before(opts.$preLoadContent.addClass('_unveil-preloadcontent'));
      }
      else if (opts.$preLoadWrapper)
        $img.wrap(opts.$preLoadWrapper.addClass('_unveil-preloadwrapper'));

      source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        $img.load(function() {
          var $tempImg = $img.clone(),
              $preLoadContent = $img.prev('._unveil-preloadcontent'),
              $preLoadWrapper = $img.parent('._unveil-preloadwrapper'),
              $newImg;
          if (opts.$postLoadWrapper) {
            var $postLoadWrapper = opts.$postLoadWrapper.clone();
            $postLoadWrapper.append($tempImg);
            $newImg = $postLoadWrapper;
          }
          else
            $newImg = $tempImg;
          if (opts.hideOnTransition)
            $newImg.hide();
          if ($preLoadWrapper.length)
            $preLoadWrapper.replaceWith($newImg);
          else if ($preLoadContent.length)
            $preLoadContent.replaceWith($newImg);
          else
            $img.replaceWith($newImg);
          if (onLoad)
            onLoad($newImg);
        }).attr('src', source);
      }
    });

    function unveil() {
      inview = images.filter(function() {
        var $e = $(this),
            wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });

      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.scroll(unveil);
    $w.resize(unveil);

    unveil();

    return this;

  };

})(jQuery);


