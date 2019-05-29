'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Created by Tzingtao on 2018/1/15.
 */

function fromQueryString(name1) {
    var reg = new RegExp('(^|&)' + name1 + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}

document.title = "Option - Problem Set" + fromQueryString("set");

var stage = $('#stage');
var stem = $(".stem");
var optionsStage = $('.options-stage');
var optionBase = $('#option-base');
var next = $('.next');
var info = $('.information');

// STATE STORAGE
var action = "toCheckAns";
var picked = new Set([]);
var currentProblem = undefined;
var solvedSet = new Set([]);
var unsolvedSet = new Set([]);
var wrongedSet = new Set([]);
var dbs = [];

var bar = new ProgressBar.Line('#progress-bar', {
    strokeWidth: 3,
    easing: 'easeInOut',
    duration: 1000,
    color: '#448800',
    trailColor: '#ddd',
    trailWidth: 1,
    svgStyle: { width: '100%', height: '100%' }
});

var problemEg = {
    id: 15349,
    stem: "这是一道测试题目。尝试选项是否可选，然后开始做题。",
    choices: ["请不要选择这一个选项", "请不要选择这一个选项", "这是正确答案", "请不要选择这一个选项"],
    rightAns: [2],
    isSingle: true
};

var finished = {
    id: "Volia",
    stem: "",
    choices: [],
    rightAns: [],
    isSingle: true
};

putNewProblem(problemEg);
bar.animate(1);

//----------------------------------

function latinify(number) {
    number++;
    if (number === 1) return "A";
    if (number === 2) return "B";
    if (number === 3) return "C";
    if (number === 4) return "D";
    if (number === 5) return "E";
    if (number === 6) return "F";else return "G";
}

function latinifyArray(array) {
    var res = "";
    array.sort();
    array.forEach(function (cur, i) {
        res += latinify(cur);
    });
    return res;
}

function numberify(latin) {
    if (latin === "A") return 0;
    if (latin === "B") return 1;
    if (latin === "C") return 2;
    if (latin === "D") return 3;
    if (latin === "E") return 4;
    if (latin === "F") return 5;else return -1;
}

function putNewProblem(problem) {

    info.fadeOut().text("");
    stage.fadeOut(300, function () {
        stem.html(problem.id + ". " + problem.stem);
        optionsStage.children('.dynamic-append').remove();
        picked.clear();
        problem.choices.forEach(function (cur, i) {
            var toAppend = optionBase.clone(true).attr('data-prefix', latinify(i)).removeAttr("id").addClass("dynamic-append");
            toAppend.find('.single-option-input').attr('data-prefix', latinify(i)).attr('name', 'problem-' + problem.id).change(function () {
                if (this.checked) {
                    picked.add(i);
                } else {
                    picked.delete(i);
                }
            });
            toAppend.find('.single-option-text').text(cur);

            optionsStage.append(toAppend);
        });
        currentProblem = problem;
        stage.fadeIn(300);
    });
}

//===============================

function nextOnClick() {

    next.click(function () {
        if (action === "toCheckAns") {
            console.log(latinifyArray([].concat(_toConsumableArray(picked))));
            console.log(latinifyArray(currentProblem.rightAns));
            if (latinifyArray([].concat(_toConsumableArray(picked))) == latinifyArray(currentProblem.rightAns)) {
                console.log("Correct");
                next.css('background-color', '#448800');
                solvedSet.add(currentProblem.id);
                unsolvedSet.delete(currentProblem.id);
            } else {
                next.css('background-color', '#aa3300');
                wrongedSet.add(currentProblem.id);
                info.fadeIn(300).text("× 正确答案为 " + latinifyArray(currentProblem.rightAns) + "。");
            }
            bar.animate(1.0 - parseFloat(unsolvedSet.size) / dbs.length);
            action = "toNextProblem";
            next.text('Next');
        } else if (action === "toNextProblem") {
            if (unsolvedSet.size === 0) {
                finished.stem = "你已经完成所有题目。现在你可以在点击 Logo 返回思政知识库主页来选择新的题库了。<div class='finished-res'>本轮答题的首次正确率：" + ((dbs.length - wrongedSet.size) * 100.0 / parseFloat(dbs.length)).toFixed(1) + "%</div>";
                putNewProblem(finished);
                $('.logo-horizontal')[0].click(function () {
                    open('index.html', '_self');
                });
            } else {
                var nextProblemId = [].concat(_toConsumableArray(unsolvedSet))[Math.floor(Math.random() * [].concat(_toConsumableArray(unsolvedSet)).length)];
                console.log([].concat(_toConsumableArray(unsolvedSet)));
                console.log(nextProblemId);
                putNewProblem(dbs[nextProblemId - 1]);
                action = "toCheckAns";
                next.text('Check');
                next.css('background-color', '#222');
            }
        }
    });
}

/*

 $.get({
 url: "problemSet1.txt",
 complete: function (res) {
 let str = res.responseText;
 let split = str.split(/[0-9][0-9]*[．.、。]/);
 let dbs = [];
 split.forEach(function (cur, id) {
 unsolvedSet.add(id);
 let formatted = {
 id: id,
 stem: undefined,
 choices: [],
 rightAns: [],
 isSingle: true
 };

 let temp = cur.split(/[【】]/);
 formatted.stem = temp[0];

 let rightAns = [];
 for (let i = 1; i < temp.length-1; i++) {
 for (let j = 0; j < temp[i].length; j++) {
 rightAns.push(temp[i].charAt(j));
 }
 }
 rightAns.sort();
 rightAns.forEach(function (thisChar, i) {
 if (numberify(thisChar) > -1) {
 formatted.rightAns.push(numberify(thisChar));
 }
 });
 formatted.isSingle = (formatted.rightAns.length === 1);


 let choices = temp[temp.length-1].split(/[A-G][．.、。]/);
 choices.forEach(function (option, at) {
 if (at !== 0) {
 formatted.choices.push(option);
 }
 if (at === 6) {
 throw new RangeException("Detected some choices overflow.");
 }
 });

 dbs.push(formatted);
 });
 dbs.shift();
 console.log(dbs);
 nextOnClick();
 }
 });

 */

$.getJSON({
    url: "data/" + fromQueryString("set") + ".json",
    complete: function complete(res) {
        console.log(res);
        dbs = res.responseJSON;
        $('.sub-info').text("Problem Set " + fromQueryString("set") + " (" + dbs.length + " Problems)");
        dbs.forEach(function (cur, i) {
            unsolvedSet.add(cur.id);
        });
        nextOnClick();
    }
});