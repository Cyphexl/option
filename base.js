function fromQueryString(name1) {
    let reg = new RegExp('(^|&)' + name1 + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}

function latinify(number) {
    if (typeof number !== "number") {
        throw new TypeError();
    }
    else if (number < 0 || number > 25) {
        throw new RangeError("Number passed in out of range, should be within 0-25");
    }
    else return String.fromCharCode(number + 'A'.charCodeAt(0));
}

function latinifyArray(array) {
    let res = "";
    array.sort();
    array.forEach(function (cur) {
        res += latinify(cur);
    });
    return res;
}

function numberify(latin) {
    if (typeof latin !== "string") {
        throw new TypeError();
    }
    else {
        if (latin <= 'z' && latin >= 'a') {
            latin = latin.toUpperCase();
        }
        if (latin < 'A' || latin > 'Z') {
            throw new RangeError("Latin passed should be within A to Z");
        }
        else return latin.charCodeAt(0) - 'A'.charCodeAt(0);
    }
}