function onSub(e) {
    e.preventDefault();
    var xhr = new XMLHttpRequest();
    var url = 'url';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log(json);
        }
    };
    var data = JSON.stringify({
        ant: document.querySelector('#ant').value,
        url: document.querySelector('#url').value,
    });
    xhr.send(data);

    return false;
}
function myFunction() {
    alert('The form was submitted');
}
var a = document.querySelector('form');
console.log(a);
a.addEventListener('submit', onSub);
