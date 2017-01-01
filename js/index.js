// ELEMENTS
var successAnswer = document.getElementById('success-answer'),
    allQuestion = document.getElementById('total-answer'),
    question = document.getElementById('quest-text'),
    id = document.getElementById('quest-number'),
    category = document.getElementById('category'),
    skip = document.getElementById('skip-button'),
    next = document.getElementById('next-button'),
    result = document.getElementById('result-letters'),
    initLetters = document.getElementById('random-letters'),
    successMessage = document.getElementById('success'),
    errorMessage = document.getElementById('error'),
    answerArray = [],
    countSuccess = 0,
    countAll = 0;

// XMLHttpRequest
var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
var xhr = new XHR();

xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var responseArr = JSON.parse(this.responseText);
        if(responseArr[0].answer[0]==='<') {
          responseArr[0].answer = responseArr[0].answer.match(/[$>]*>(.*?)<\//)[1];
        }
        var splitAnswerArray = responseArr[0].answer.split('');

        question.innerHTML = responseArr[0].question;
        id.innerHTML = responseArr[0].id;
        category.innerHTML = responseArr[0].category.title;
        console.log('Answer:', responseArr[0].answer); // correct answer

        // block with random letter's position
        splitAnswerArray.sort(function() {
            return Math.random() - 0.5;
        }).forEach(function(item, i, array) {
            var newLetter = document.createElement('a');
            newLetter.classList.add("waves-effect", "waves-light", "btn", "letter-item", "grey", "darken-4");
            newLetter.innerHTML = item;
            initLetters.appendChild(newLetter);
            // console.log();
        });
    }

    // click random LETTER and add in answer block
    initLetters.onclick = function() {
        pushLetter(event.target, responseArr[0].answer);

        // show button
        if (initLetters.children.length === 0) {
            if (answerArray.join('') === responseArr[0].answer) {
                successMessage.className += 'show';
                next.classList.remove("hide");
                result.classList.add("success");
            } else { // wrong word
                error.classList.remove("hide");
                result.classList.add("error");
            }
        }
    };
    result.onclick = function() {
        pushLetter(event.target, responseArr[0].answer);
    };


    // NEXT
    next.onclick = function() {
        if (answerArray.join('') === responseArr[0].answer) {
            countSuccess++;
            countAll++;
            refresh();
        }
    };
    // SKIP
    skip.onclick = function() {
            countAll++;
            refresh();
    };
    // DATA refresh
    function refresh() {
      successAnswer.innerHTML = countSuccess;
      allQuestion.innerHTML = countAll;
      result.innerHTML = "";
      initLetters.innerHTML = "";
      result.classList.remove("error");
      result.classList.remove("success");
      success.classList.add('hide');
      error.classList.add('hide');
      next.classList.add('hide');
      answerArray = [];
      xhr.open('GET', 'https://jservice.io/api/random', true);
      xhr.send();
    }
};

xhr.open('GET', 'https://jservice.io/api/random', true);
xhr.send();


// ////////////////////////////
//                 Toggle leter
// ///////////////////////////
function pushLetter(item, answer) {
    if (item.tagName == 'A' && answerArray.join('') !== answer) {
        result.classList.remove("error");
        error.classList.add('hide');
        var newItem = document.createElement('a');
        newItem.innerHTML = item.innerHTML;
        newItem.classList.add("waves-effect", "waves-light", "btn", "letter-item");
        //console.log(item.parentNode.id);
        if (item.parentNode.id == initLetters.id) { // push letter from init block
            newItem.classList.add("pink", "lighten-2");
            result.appendChild(newItem);
            initLetters.removeChild(item);
            answerArray.push(item.innerHTML);
        } else if (item.parentNode.id == result.id) { // push letter from answer block
            newItem.classList.add("grey", "darken-4");
            initLetters.appendChild(newItem);
            result.removeChild(item);
            answerArray = [];
            for (var i = 0; i < result.children.length; i++) {
                answerArray[i] = result.children[i].innerHTML;
            }
        }
    }
}
