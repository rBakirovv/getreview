[GH Pages](https://rbakirovv.github.io/getreview/)

## Подключение

* Подключить getreview.css и getreview.js
* Перед getreview.js:

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
        videoSrc: "./Пилот получил привлекательное предложение от картеля.mp4", // нужно задать обязательно [!]
        previewSrc: "", // по дефолту будет равно videoSrc
        title: "Заголовок побольше", // заголовок, можно не задавать
        subtitle: "Какой-то текст подзаголовок", // подзаголовок, можно не задавать
      }
    </script>
  ````