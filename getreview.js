var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

(() => {
  const throttle = (type, name, obj) => {
    obj = obj || window;
    let running = false;
    const func = () => {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };

  throttle('resize', 'optimizedResize');
})();

(obj => {
  obj = obj || window;
  obj.animation = (elem, prop, cb) => {
    const count = prop.count;
    let counter = 0;
    if (prop.start) {
      prop.start.forEach(item => {
        elem.style[item[0]] = item[1];
      });
    }

    const allAnimation = [];

    prop.anim.forEach(([style, from, to]) => {
      const max = Math.max(from, to);
      const min = Math.min(from, to);
      const step = (max - min) / count;
      allAnimation.push({
        style,
        from,
        to,
        step,
        reverse: min === to
      });
    });

    const rafAnimation = () => {
      allAnimation.forEach(item => {
        if (item.reverse) {
          item.from -= item.step;
        } else {
          item.from += item.step;
        }

        elem.style[item.style] = item.from;
      });

      counter++;
      if (counter < count) {
        requestAnimationFrame(rafAnimation);
      } else {
        if (prop.end) {
          prop.end.forEach(item => {
            elem.style[item[0]] = item[1];
          });
        }
        if (cb) cb();
      }
    };
    requestAnimationFrame(rafAnimation);
  };
})();

const init = () => {
  const overlay = document.createElement('div');
  overlay.className = 'videotube-modal-overlay';
  document.body.insertAdjacentElement('beforeend', overlay);

  const videotubeModalOverlay = document.querySelector(".videotube-modal-overlay");

  const video = document.createElement('div');
  video.id = 'videotube-modal-container';

  const sizeBlockList = [
    [3840, 2160],
    [2560, 1440],
    [1920, 1080],
    [1280, 720],
    [854, 420],
    [640, 360],
    [426, 240],
  ];

  const sizeVideo = () => {
    const sizeBlock =
      sizeBlockList.find(item => item[0] < window.visualViewport.width) ||
      sizeBlockList[sizeBlockList.length - 1];

    const iframe = document.getElementById('videotube-modal-container');
    iframe.width = sizeBlock[0];
    iframe.height = sizeBlock[1];
    video.style.cssText = `
			width: ${sizeBlock[0]};
			height: ${sizeBlock[1]};
		`;
  };

  const sizeContainer = () => {
    const wh = window.visualViewport.height;
    const ww = window.visualViewport.width;
    const fw = video.style.width;
    const fh = video.style.height;

    video.style.left = (ww - fw) / 2;
    video.style.top = (wh - fh) / 2;
    overlay.style.height = document.documentElement.clientHeight;
  };

  const sizeVideoTubeModal = () => {
    sizeContainer();
    sizeVideo();
  };

  const closeVideoTubeModal = () => {
    videotubeModalOverlay.style.pointerEvents = 'none';
    animation(
      overlay, {
        end: [
          ['display', 'none']
        ],
        anim: [
          ['opacity', 1, 0]
        ],
        count: 20,
      },
      //() => {
      //overlay.textContent = '';
      //},
    );

    player.pauseVideo();

    window.removeEventListener('optimizedResize', sizeVideoTubeModal);
    document.removeEventListener('keyup', closeContainerEsc);
  };

  const closeContainerEsc = e => {
    if (e.keyCode === 27) {
      closeVideoTubeModal();
    }
  };

  const openVideoTubeModal = e => {
    if (e.target.closest(".tube")) {
      videotubeModalOverlay.style.pointerEvents = 'all';
    }

    const target = e.target.closest('.tube');
    if (!target) return;

    const href = target.href;
    const search = href.includes('youtube');
    let idVideo = search ?
      href.match(/(\?|&)v=([^&]+)/)[2] :
      href.match(/(\.be\/)([^&]+)/)[2];

    if (idVideo.length === 0) return;

    e.preventDefault();

    animation(overlay, {
      start: [
        ['display', 'block']
      ],
      anim: [
        ['opacity', 0, 1]
      ],
      count: 20,
    });

    if (!document.querySelector("#videotube-modal-container")) {
      overlay.insertAdjacentHTML(
        'beforeend',
        `
        <div id="videotube-modal-close">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"></path></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"></path></g></g></svg>
        </div>
        <div id="videotube-modal-container">
        </div>
      `,
      );
    }

    if (player) {
      player.playVideo();
    } else {
      player = new YT.Player('videotube-modal-container', {

        playerVars: {
          'controls': 0,
          'showinfo': 0,
          'rel': 0,
          'autoplay': 0,
          'playsinline': 1
        },
        videoId: idVideo,
        events: {
          'onReady': onPlayerReady,
        }
      });
    }


    function onPlayerReady() {
      player.playVideo();
    }

    sizeVideo();
    sizeContainer();

    window.addEventListener('optimizedResize', sizeVideoTubeModal);
    document.addEventListener('keyup', closeContainerEsc);
  };
  overlay.addEventListener('click', closeVideoTubeModal);
  document.addEventListener('click', openVideoTubeModal);
};

window.addEventListener("DOMContentLoaded", function () {
  init();

  const body = document.querySelector("body");

  const searchIframe = optionsGetreview.videoSrc.includes('youtube');
  let idVideoIframe = searchIframe ?
    optionsGetreview.videoSrc.match(/(\?|&)v=([^&]+)/)[2] :
    optionsGetreview.videoSrc.match(/(\.be\/)([^&]+)/)[2];

  body.insertAdjacentHTML('beforeEnd',
    `
      <div class="getreview-widget">
        <div class="getreview-widget__close">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="17" y="30" width="18" height="2" rx="1" transform="rotate(-45 17 30)" fill="rgba(255, 255, 255, 1)">
            </rect>
            <rect width="18" height="2" rx="1" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 31 30)"
              fill="rgba(255, 255, 255, 1)"></rect>
          </svg>
        </div>
        <div class="getreview-widget__text">
          <h6>${(optionsGetreview.title && optionsGetreview.title !== '') ? optionsGetreview.title : ''}</h6>
          <p>${(optionsGetreview.subtitle && optionsGetreview.subtitle !== '') ? optionsGetreview.subtitle : ''}</p>
        </div>
        <a href="${optionsGetreview.videoSrc}" class="getreview__video-container ${optionsGetreview.lightbox === 'videotube' ? "tube" : optionsGetreview.lightbox === 'glightbox' ? 'glightbox-widget' : 'iframe'}">
          <video preload="none" autoplay playsinline loop muted class="getreview-widget__video">
            <source src="${(optionsGetreview.previewSrc && optionsGetreview.previewSrc !== '') ? optionsGetreview.previewSrc : optionsGetreview.videoSrc}" type="video/mp4">
          </video>
        </a>
      </div>
      <div class="getreview-widget__video-wrap">
        <div class="getreview-widget__close">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="17" y="30" width="18" height="2" rx="1" transform="rotate(-45 17 30)" fill="rgba(255, 255, 255, 1)">
            </rect>
            <rect width="18" height="2" rx="1" transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 31 30)"
              fill="rgba(255, 255, 255, 1)"></rect>
          </svg>
        </div>
        <div class="getreview-widget__iframe-container ${optionsGetreview.lightbox === 'iframe' ? '' : 'dis-none'}">
          <iframe width="${optionsGetreview.iframeWidth ? optionsGetreview.iframeWidth : 260}" height="${optionsGetreview.iframeHeight ? optionsGetreview.iframeHeight : 145}"  ${optionsGetreview.lightbox === 'iframe' ? `src="https://youtube.com/embed/${idVideoIframe}?autoplay=1"` : ''}  frameborder="0" allow="autoplay" allowfullscreen></iframe>
        </div>
      </div>
    `);

  const widget = document.querySelector(".getreview-widget");
  const widgetClose = widget && widget.querySelector(".getreview-widget__close");
  const widgetVideo = widget && widget.querySelector("video");
  const widgetVideoWrap = document.querySelector(".getreview-widget__video-wrap");
  const widgetVideoContainer = widget.querySelector(".getreview__video-container.iframe");
  const widgetVideoWrapClose = widgetVideoWrap.querySelector(".getreview-widget__close");

  /* Настройки glightbox */
  if (optionsGetreview.lightbox === "glightbox") {
    const lightbox = GLightbox({
      selector: '.glightbox-widget'
    });
  }

  if (optionsGetreview.borderHover && optionsGetreview.borderHover !== "") {
    document.documentElement.style.setProperty('--hover-getreview-border', `${optionsGetreview.borderHover}`);
  }

  var videoSource = widgetVideo.querySelector("source");

  if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
    setTimeout(() => {
      widget.classList.add("loaded");
    }, 200)
  }

  widgetClose && widgetClose.addEventListener("click", (e) => {
    widget.classList.add("dis-none");
  })

  function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);

    if (isMobile) {
      return "mobile";
    } else {
      return "desktop";
    }
  }

  if (getDeviceType() === "mobile") {
    widget.classList.add("mobile");
  }

  function sideIndentationHandler() {
    if (optionsGetreview.position === 'left') {
      if (optionsGetreview.sideIndentation) {
        widget.style.right = `initial`;
        widget.style.left = `${optionsGetreview.sideIndentation}px`;

        widgetVideoWrap.style.right = `initial`;
        widgetVideoWrap.style.left = `${optionsGetreview.sideIndentation}px`;
      } else {
        widget.style.right = `initial`;
        widget.style.left = `50px`;

        widgetVideoWrap.style.right = `initial`;
        widgetVideoWrap.style.left = `50px`;
      }
    } else if (optionsGetreview.position === 'right') {
      if (optionsGetreview.sideIndentation) {
        widget.style.left = `initial`;
        widget.style.right = `${optionsGetreview.sideIndentation}px`;

        widgetVideoWrap.style.left = `initial`;
        widgetVideoWrap.style.right = `${optionsGetreview.sideIndentation}px`;
      } else {
        widget.style.left = `initial`;
        widget.style.right = `50px`;

        widgetVideoWrap.style.left = `initial`;
        widgetVideoWrap.style.right = `50px`;
      }
    }
  }

  sideIndentationHandler();

  function mobileSideIndentationHandler() {
    if (window.innerWidth <= 500) {
      if (optionsGetreview.positionMobile === 'left') {
        if (optionsGetreview.sideIndentationMobile) {
          widget.style.right = `initial`;
          widget.style.left = `${optionsGetreview.sideIndentationMobile}px`;

          widgetVideoWrap.style.right = `initial`;
          widgetVideoWrap.style.left = `${optionsGetreview.sideIndentationMobile}px`;
        } else {
          widget.style.right = `initial`;
          widget.style.left = `25px`;

          widgetVideoWrap.style.right = `initial`;
          widgetVideoWrap.style.left = `25px`;
        }
      } else if (optionsGetreview.positionMobile === 'right') {
        if (optionsGetreview.sideIndentationMobile) {
          widget.style.left = `initial`;
          widget.style.right = `${optionsGetreview.sideIndentationMobile}px`;

          widgetVideoWrap.style.left = `initial`;
          widgetVideoWrap.style.right = `${optionsGetreview.sideIndentationMobile}px`;
        } else {
          widget.style.left = `initial`;
          widget.style.right = `25px`;

          widgetVideoWrap.style.left = `initial`;
          widgetVideoWrap.style.right = `25px`;
        }
      } else if (!optionsGetreview.positionMobile || optionsGetreview.positionMobile === '') {
        if (optionsGetreview.position === 'left') {
          widget.style.right = `initial`;
          widget.style.left = `25px`;

          widgetVideoWrap.style.right = `initial`;
          widgetVideoWrap.style.left = `25px`;
        } else if (optionsGetreview.position === 'right') {
          widget.style.left = `initial`;
          widget.style.right = `25px`;

          widgetVideoWrap.style.left = `initial`;
          widgetVideoWrap.style.right = `25px`;
        }
      }
    } else {
      sideIndentationHandler();
    }
  }

  mobileSideIndentationHandler();

  function bottomIndentationHandler() {
    if (optionsGetreview.sideIndentation) {
      widget.style.bottom = `${optionsGetreview.sideIndentation}px`;

      widgetVideoWrap.style.bottom = `${optionsGetreview.sideIndentation}px`;
    } else {
      widget.style.bottom = `50px`;

      widgetVideoWrap.style.bottom = `50px`;
    }
  }

  bottomIndentationHandler();

  function mobileBottomIndentationHandler() {
    if (window.innerWidth <= 500) {
      if (optionsGetreview.bottomIndentationMobile) {
        widget.style.bottom = `${optionsGetreview.bottomIndentationMobile}px`;

        widgetVideoWrap.style.bottom = `${optionsGetreview.bottomIndentationMobile}px`;
      } else {
        widget.style.bottom = `25px`;

        widgetVideoWrap.style.bottom = `25px`;
      }
    } else {
      bottomIndentationHandler();
    }
  }

  mobileBottomIndentationHandler();

  if (optionsGetreview.lightbox === 'iframe') {
    widgetVideoContainer && widgetVideoContainer.addEventListener(("click"), (e) => {
      e.preventDefault();

      widget.classList.add("dis-none");
      widgetVideoWrap.classList.add("active");
    })
  }

  widgetVideoWrapClose && widgetVideoWrapClose.addEventListener("click", () => {
    widget.classList.remove("dis-none");
    widgetVideoWrap.classList.remove("active");
  })

  window.addEventListener("resize", () => {
    setTimeout(() => {
      mobileSideIndentationHandler();
      mobileBottomIndentationHandler();
    }, 500)
  })
})