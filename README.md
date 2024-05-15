[GH Pages](https://rbakirovv.github.io/getreview/)

[GH Pages (2-й вариант)](https://rbakirovv.github.io/getreview/iframe.html)

## Подключение

* Подключить getreview.min.css и getreview.min.js
* Перед getreview.min.js:

  ````
  <script>
    //  Опции для виджета.
    let optionsGetreview = {
      position: "left", // left или right, по дефолту будет left
      positionMobile: "right", // left или right на моб., по дефолту будет повторять position
      sideIndentation: 50, // Отступ сбоку, число
      bottomIndentation: 50, // Отступ снизу, число
      sideIndentationMobile: 25, // Отступ сбоку на моб., число, по дефолту будет 25px
      bottomIndentationMobile: 25, // Отступ снизу на моб., число, по дефолту будет 25px
      videoSrc: "https://youtu.be/0i23m2720DM?si=oRCMopHCMRLlhaJI", // нужно задать обязательно [!]
      previewSrc: "./Пилот получил привлекательное предложение от картеля.mp4", // по дефолту будет равно videoSrc
      title: "Текст", // заголовок, можно не задавать
      subtitle: "Ещё текст", // подзаголовок, можно не задавать
      lightbox: "videotube", // модалка videotube или фикс. баннер iframe
    }
  </script>
  ````