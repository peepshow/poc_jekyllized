(function($) {

  $('#scene').parallax({
    relativeInput: false,
    clipRelativeInput: false,
    calibrationThreshold: 100,
    calibrationDelay: 500,
    supportDelay: 500,
    calibrateX: false,
    calibrateY: true,
    invertX: true,
    invertY: true,
    limitX: false,
    limitY: false,
    scalarX: 5.0,
    scalarY: 5.0,
    frictionX: 0.1,
    frictionY: 0.1,
    originX: 0.5,
    originY: 0.5
  });



  function scrollmagic() {

    var ctrl = new ScrollMagic.Controller();

    // Create theme scenes
    $(".theme").each(function() {

      var swapClip = TweenLite.from(this, 1, {
        opacity: 0
      })

      new ScrollMagic.Scene({
        triggerElement: this,
        triggerHook: 0.5,
        offset: 0,
        duration: $(this).height(),
      })
      .setTween(swapClip)
      .addTo(ctrl);

      new ScrollMagic.Scene({
        triggerElement: this,
        triggerHook: 0.5,
        offset: 0,
        duration: $(this).height() * 3
      })
      .setClassToggle(this, "active_video")
      .addTo(ctrl);

    });


    // Move the background image
    var bgheight = $('#bgimage').height();
    var bgMove = TweenLite.to($('#bgimage'), 1, {
      y: '-=' + (bgheight / 2),
      ease: Linear.easeNone
    })

    new ScrollMagic.Scene({
      duration: $(document).height() * 2,
      triggerElement: 'body',
      triggerHook: 0.5,
    })
    .setTween(bgMove)
    .addTo(ctrl);

  }

  if($('#chapter').length > 0 ){
    scrollmagic();
    videoControl();
  }


  function videoControl() {

    // When a video is played pause all other playback
    $(".video-js").each(function (videoIndex) {

      var videoId = $(this).attr('id');
      var blurb = $(this).parents('.main_video');

      videojs(videoId).ready(function() {
        this.on("play", function(e) {

          $(blurb).addClass('playing');
          $(blurb).removeClass('paused');

          //pause other video
          $(".video-js").each(function(index) {
            if (videoIndex !== index) {
              this.player.pause();
            }
          });
        });

        this.on("pause", function(e) {
          $(blurb).removeClass('playing');
          $(blurb).addClass('paused');
        });
      });


    });



  }

  // Check the scroll position and pause video playback if a clip is out of frame.
  function checkActive() {
    $(".video-js").each(function (videoIndex) {
      if ($(this).parents('.active_video').length == 0) {
        if (!$(this).paused) {
          this.player.pause();
        }
      }
    });
  }

  function sitemapOverlay() {
    var isLateralNavAnimating = false;

    //open/close lateral navigation
    $('.cd-nav-trigger').on('click', function(event){
      event.preventDefault();
      //stop if nav animation is running
      if( !isLateralNavAnimating ) {
        if($(this).parents('.csstransitions').length > 0 ) isLateralNavAnimating = true;

        $('body').toggleClass('navigation-is-open');
        $('.cd-navigation-wrapper').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
          //animation is over
          isLateralNavAnimating = false;
        });
      }
    });


  }



  $(window).scroll(function() {
    //checkActive();
  });


  $(document).ready(function() {
    // scrollTo('.mainMenu-links')		;
    scrollTo();
    scrollToTop();
        sitemapOverlay();
  });

  function scrollTo() {
    $('#theme_nav li a').click(function(e) {
      e.preventDefault();
      $('.mainMenu a').removeClass('active');
      $(this).addClass('active');

      var distanceTopToSection = $('#' + $(this).data('target')).offset().top;

      $('body, html').animate({
        scrollTop: distanceTopToSection
      }, 'slow');
    });
  }


  function scrollToTop() {
    var backToTop = $('.backToTop');
    var showBackTotop = $(window).height();
    backToTop.hide();

    var children = $("#theme_nav li").children();
    var tab = [];
    for (var i = 0; i < children.length; i++) {
      //console.log(children[i]);
      var child = children[i];
      var ahref = $(child).attr('href');
      //console.log(ahref);
      tab.push(ahref);
    }


    $(window).scroll(function() {
      var windowScrollTop = $(window).scrollTop();
      if (windowScrollTop > showBackTotop) {
        backToTop.fadeIn('slow');
      } else {
        backToTop.fadeOut('slow');
      }

      var windowHeight = $(window).height();
      var docHeight = $(document).height();

      for (var i = 0; i < tab.length; i++) {
        var link = tab[i];
        var divPos = $(link).offset().top;
        var divHeight = $(link).height();
        if (windowScrollTop >= divPos && windowScrollTop < (divPos + divHeight)) {
          $("#theme_nav a[href='" + link + "']").addClass("active");
        } else {
          $("#theme_nav a[href='" + link + "']").removeClass("active");
        }
      }

      if (windowScrollTop + windowHeight == docHeight) {
        if (!$("#theme_nav li:last-child a").hasClass("active")) {
          var navActive = $(".active").attr("href");
          $("#theme_nav a[href='" + navActive + "']").removeClass("active");
          $("#theme_nav li:last-child a").addClass("active");
        }
      }
    });

    backToTop.click(function(e) {
      e.preventDefault();
      $(' #theme_nav li a ').removeClass('active');
      $(' #theme_nav li a:first ').addClass('active');
      $(' body, html ').animate({
        scrollTop: 0
      }, 'slow');
    });
  }

  $("#flat").flipster({
    style: 'flat',
    buttons: true,
    scrollwheel: false,
    spacing: 0
  });




}(jQuery));



var Modal = (function() {

  var trigger = $qsa('.modal__trigger'); // what you click to activate the modal
  var modals = $qsa('.modal'); // the entire modal (takes up entire window)
  var modalsbg = $qsa('.modal__bg'); // the entire modal (takes up entire window)
  var content = $qsa('.modal__content'); // the inner content of the modal
  var closers = $qsa('.modal__close'); // an element used to close the modal
  var w = window;
  var isOpen = false;
  var contentDelay = 400; // duration after you click the button and wait for the content to show
  var len = trigger.length;

  // make it easier for yourself by not having to type as much to select an element
  function $qsa(el) {
    return document.querySelectorAll(el);
  }

  var getId = function(event) {

    event.preventDefault();
    var self = this;
    // get the value of the data-modal attribute from the button
    var modalId = self.dataset.modal;
    var len = modalId.length;
    // remove the '#' from the string
    var modalIdTrimmed = modalId.substring(1, len);
    // select the modal we want to activate
    var modal = document.getElementById(modalIdTrimmed);
    // execute function that creates the temporary expanding div
    makeDiv(self, modal);
  };

  var makeDiv = function(self, modal) {

    var fakediv = document.getElementById('modal__temp');

    /**
     * if there isn't a 'fakediv', create one and append it to the button that was
     * clicked. after that execute the function 'moveTrig' which handles the animations.
     */

    if (fakediv === null) {
      var div = document.createElement('div');
      div.id = 'modal__temp';
      self.appendChild(div);
      moveTrig(self, modal, div);
    }
  };

  var moveTrig = function(trig, modal, div) {
    var trigProps = trig.getBoundingClientRect();
    var m = modal;
    var mProps = m.querySelector('.modal__content').getBoundingClientRect();
    var transX, transY, scaleX, scaleY;
    var xc = w.innerWidth / 2;
    var yc = w.innerHeight / 2;

    // this class increases z-index value so the button goes overtop the other buttons
    trig.classList.add('modal__trigger--active');

    // these values are used for scale the temporary div to the same size as the modal
    scaleX = mProps.width / trigProps.width;
    scaleY = mProps.height / trigProps.height;

    scaleX = scaleX.toFixed(3); // round to 3 decimal places
    scaleY = scaleY.toFixed(3);


    // these values are used to move the button to the center of the window
    transX = Math.round(xc - trigProps.left - trigProps.width / 2);
    transY = Math.round(yc - trigProps.top - trigProps.height / 2);

    // if the modal is aligned to the top then move the button to the center-y of the modal instead of the window
    if (m.classList.contains('modal--align-top')) {
      transY = Math.round(mProps.height / 2 + mProps.top - trigProps.top - trigProps.height / 2);
    }


    // translate button to center of screen
    trig.style.transform = 'translate(' + transX + 'px, ' + transY + 'px)';
    trig.style.webkitTransform = 'translate(' + transX + 'px, ' + transY + 'px)';
    // expand temporary div to the same size as the modal
    div.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';
    div.style.webkitTransform = 'scale(' + scaleX + ',' + scaleY + ')';


    window.setTimeout(function() {
      window.requestAnimationFrame(function() {
        open(m, div);
      });
    }, contentDelay);

  };

  var open = function(m, div) {

    if (!isOpen) {
      // select the content inside the modal
      var content = m.querySelector('.modal__content');
      // reveal the modal
      m.classList.add('modal--active');
      // reveal the modal content
      content.classList.add('modal__content--active');

      /**
       * when the modal content is finished transitioning, fadeout the temporary
       * expanding div so when the window resizes it isn't visible ( it doesn't
       * move with the window).
       */

      content.addEventListener('transitionend', hideDiv, false);

      isOpen = true;
    }

    function hideDiv() {
      // fadeout div so that it can't be seen when the window is resized
      div.style.opacity = '0';
      content.removeEventListener('transitionend', hideDiv, false);
    }
  };

  var close = function(event) {

    event.preventDefault();
    event.stopImmediatePropagation();

    var target = event.target;
    var div = document.getElementById('modal__temp');

    /**
     * make sure the modal__bg or modal__close was clicked, we don't want to be able to click
     * inside the modal and have it close.
     */
     function checkActiveModal() {
       $(".video-js").each(function (videoIndex) {
         if ($(this).parents('.modal--active').length !== 0) {
           if (!$(this).paused) {
             this.player.pause();
           }
         }
       });
     }


    if (isOpen && target.classList.contains('modal__bg') || target.classList.contains('modal__close')) {

      // make the hidden div visible again and remove the transforms so it scales back to its original size
      div.style.opacity = '1';
      div.removeAttribute('style');

      checkActiveModal()
      /**
       * iterate through the modals and modal contents and triggers to remove their active classes.
       * remove the inline css from the trigger to move it back into its original position.
       */

      for (var i = 0; i < len; i++) {
        modals[i].classList.remove('modal--active');
        content[i].classList.remove('modal__content--active');
        trigger[i].style.transform = 'none';
        trigger[i].style.webkitTransform = 'none';
        trigger[i].classList.remove('modal__trigger--active');
      }

      // when the temporary div is opacity:1 again, we want to remove it from the dom
      div.addEventListener('transitionend', removeDiv, false);

      isOpen = false;

    }

    function removeDiv() {
      setTimeout(function() {
        window.requestAnimationFrame(function() {
          // remove the temp div from the dom with a slight delay so the animation looks good
          div.remove();
        });
      }, contentDelay - 50);
    }

  };

  var bindActions = function() {
    for (var i = 0; i < len; i++) {
      trigger[i].addEventListener('click', getId, false);
      closers[i].addEventListener('click', close, false);
      modalsbg[i].addEventListener('click', close, false);
    }
  };

  var init = function() {
    bindActions();
  };

  return {
    init: init
  };

}());

Modal.init();
