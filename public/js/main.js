$(document).ready(function() {

        var numEquations = 0,
            expr = $('#expr'),
            resultList = $('#result-list'),
            errorMessage = $('#error-message'),
            dismissError = $('#dismiss'),
            inputForm = $('form'),
            socket = io();

        errorMessage.hide();

        $.get('/api/v1/calc', function(data) {
            numEquations = data.length;
            data.forEach(function (item) {
                resultList.append(makeItem(item.text));
            });
        });

        inputForm.submit(function() {
            errorMessage.hide();
            socket.emit('message', expr.val());
            expr.val('');
            return false;
        });

        dismissError.click(function() {
            errorMessage.hide();
        });

        socket.on('message', function(equation) {
            resultList.prepend(makeItem(equation));

            if (numEquations === 10) {
                $('li').last().remove();
            } else {
                numEquations++;
            }
        });

        socket.on('err', function(msg) {
            errorMessage.show();
        });

        function makeItem(equation) {
            return '<li class="list-group-item">' + equation + '</li>';
        }
});
