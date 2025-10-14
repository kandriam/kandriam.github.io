var viewEnglish = false;


function toggleEnglish() {
    var elements = document.getElementsByClassName("english");
    if (elements[0].style.display === "none") {
        viewEnglish = false;
    }
    if (viewEnglish) {
        // Hide English content
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";
        }
    } else {
        // Show English content
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "block";
        }
    }
    viewEnglish = !viewEnglish;
}