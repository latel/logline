function test(protocol) {
    if (!Logline) {
        document.querySelector('h1').innerHTML = 'Logline is not been properly built.';
        document.querySelector('h1').style.color = 'red';
        throw new Error('Logline is not been properly built.');
    }

    if (!Logline.PROTOCOL[protocol.toUpperCase()]) {
        document.querySelector('h1').innerHTML = 'Error: Logline is not build with ' + protocol + ' protocol.';
        document.querySelector('h1').style.color = 'red';
        throw new Error('Logline is not build with ' + protocol + ' protocol.');
    }

    Logline.using(Logline.PROTOCOL[protocol.toUpperCase()]);

    document.querySelector('#add').addEventListener('click', function () {
        var forms = new FormData(document.forms.namedItem("form"));
        if (!forms.get('namespace')) {
            alert('模块名不可为空');
            return false;
        }
        if (!forms.get('descriptor')) {
            alert('描述符不可为空');
            return false;
        }
        var log = new Logline(forms.get('namespace'));
        log[forms.get('level')](forms.get('descriptor'), forms.get('data'));
    });

    document.querySelector('#keep').addEventListener('click', function () {
        Logline.keep(0);
    });

    document.querySelector('#clean').addEventListener('click', function () {
        Logline.clean();
    });

    document.querySelector('form').addEventListener('submit', function(ev) {
        ev.preventDefault();
    });

    setInterval(function () {
        if (Logline.PROTOCOL[protocol.toUpperCase()].status === 2) {
            Logline.getAll(function (logs) {
                var html = '',
                    i;
                for (i = 0; i < logs.length; i++) {
                    html += Object.values(logs[i]).join('\t') + '<br/>';
                }
                document.querySelector('article').innerHTML = html;
            });
        }
    }, 200);
}
