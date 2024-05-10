window.addEventListener("DOMContentLoaded", function () {
  const widget = document.querySelector(".getreview-widget");
  const widgetClose = widget.querySelector(".getreview-widget__close");

  widgetClose && widgetClose.addEventListener("click", () => {
    if (!widget.classList.contains("active")) {
      widget.classList.add("dis-none");
    }
  })
})