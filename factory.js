$('#generate').click(function () {

    let str = $('#factory-str').val();
    let rightAnsBefore = $('#rightans-before').val();
    let rightAnsAfter = $('#rightans-after').val();
    let idAfter = $('#id-after').val();
    let optionAfter = $('#option-after').val();

    let split = str.split(new RegExp("[0-9]+" + idAfter));
    split.shift();
    let dbs = [];

    for (let id = 1; id <= split.length; id++) {

        let cur = split[id-1];

        let formatted = {
            id: id,
            stem: undefined,
            choices: [],
            rightAns: [],
            isSingle: true
        };

        let temp;

        if (rightAnsBefore.length === 0) {
            temp = cur.split(new RegExp("([A-G]+)[　]*" + rightAnsAfter, 'i'));
        } else {
            temp = cur.split(new RegExp(rightAnsBefore + "[ 　]*([A-G]+)[ 　]*" + rightAnsAfter, 'i'));
        }

        if (temp.length !== 3) {
            console.log("Something weird detected that one of the problems were split into less or more than 3 pieces. The involved problem below (ID-" + id + ") is therefore abandoned by the continuing process.");
            console.log(cur);
            continue;
        }

        formatted.stem = temp[0];

        let rightAnsSet = new Set([]);
        for (let i = 1; i < temp.length-1; i++) {
            for (let j = 0; j < temp[i].length; j++) {
                rightAnsSet.add(temp[i].charAt(j));
            }
        }

        let rightAns = [...rightAnsSet];
        rightAns.sort();
        rightAns.forEach(function (thisChar) {
            if (numberify(thisChar) > -1) {
                formatted.rightAns.push(numberify(thisChar));
            }
        });


        let choices = temp[temp.length-1].split(new RegExp("[A-Z]+" + optionAfter));
        choices.shift();
        choices.forEach(function (option) {
            formatted.choices.push(option);
        });

        // Validating numOfElements in RightAns Set and Choices Set

        if (rightAns.length === 0) {
            console.log("Warning: There is a problem with no right answer.");
            console.log(cur);
        }
        if (choices.length === 0) {
            console.log("Detected a problem with no choices. The involved problem ID-" + id + " is therefore abandoned by the continuing process.");
            console.log(cur);
            continue;
        }
        if (choices.length < rightAns.length) {
            console.log("Detected a problem with more right answers than its choices. The involved problem ID-" + id + " is therefore abandoned by the continuing process.");
            console.log(cur);
        }
        if (choices.length > 10 || rightAns.length > 10) {
            console.log("Warning: There is a problem with more than ten choices or right answers.");
            console.log(cur);
        }

        formatted.isSingle = (formatted.rightAns.length === 1);
        dbs.push(formatted);
    }


    console.log(dbs);

});