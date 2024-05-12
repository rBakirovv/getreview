window.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector("body");

  body.insertAdjacentHTML('beforeEnd',
    `
      <div class="getreview-widget ${(optionsGetreview.position && optionsGetreview.position !== '') ? optionsGetreview.position : 'left'}">
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
        <a href="${optionsGetreview.videoSrc}" class="glightbox-widget">
          <video autoplay muted loop class="getreview-widget__video">
            <source src="${(optionsGetreview.previewSrc && optionsGetreview.previewSrc !== '') ? optionsGetreview.previewSrc : optionsGetreview.videoSrc}" type="video/mp4">
          </video>
        </a>
      </div>
    `);

  const widget = document.querySelector(".getreview-widget");
  const widgetClose = widget.querySelector(".getreview-widget__close");

  /* Настройки glightbox */
  const lightbox = GLightbox({
    selector: '.glightbox-widget'
  });

  widgetClose && widgetClose.addEventListener("click", () => {
    if (!widget.classList.contains("active")) {
      widget.classList.add("dis-none");
    }
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
})