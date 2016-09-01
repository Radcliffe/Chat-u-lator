/*global $, io*/

$(document).ready(function () {
    'use strict';

    var numEquations = 0,
        expr = $('#expr'),
        resultList = $('#result-list'),
        errorMessage = $('#error-message'),
        errorText = $('#error-text'),
        dismissError = $('#dismiss'),
        inputForm = $('form'),
        socket = io();

    errorMessage.hide();

    function makeItem(equation) {
        return '<li class="list-group-item">' + equation + '</li>';
    }

    $.get('/api/v1/calc', function (data) {
        numEquations = data.length;
        data.forEach(function (item) {
            resultList.append(makeItem(item.text));
        });
    });

    inputForm.submit(function () {
        errorMessage.hide();
        socket.emit('message', expr.val());
        expr.val('');
        return false;
    });

    dismissError.click(function () {
        errorMessage.hide();
    });

    socket.on('message', function (equation) {
        resultList.prepend(makeItem(equation));

        if (numEquations === 10) {
            $('li').last().remove();
        } else {
            numEquations += 1;
        }
    });

    socket.on('err', function (msg) {
        errorText.text(msg);
        errorMessage.show();
    });

});
