﻿/// <reference path="../../jquery-3.3.1.intellisense.js" />
//Load Data in Table when documents is ready
$(document).ready(function () {
    loadData();
    loadListas();
});

function convertDate(date) {
    var parts = date.split(/[- :]/);
    return date = `${parts[2]}/${parts[1]}/${parts[0]}`;

}
//Load Data function
function loadData() {
    $.ajax({
        url: "/TarefasAjax/ObterTarefas",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, item) {
                html += '<tr>';
                html += '<td>' + item.Titulo + '</td>';
                html += '<td>' + item.Descricao + '</td>';
                html += '<td>' + new Date(item.DataCriacao) + '</td>';
                html += '<td>' + item.Conlcuido + '</td>';
                html += '<td><a href="#" onclick="return getbyID(' + item.Id + ')">Edit</a> | <a href="#" onclick="Delele(' + item.Id + ')">Delete</a></td>';
                html += '</tr>';
            });
            $('#Tarefas').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}


function loadListas(id) {
    $.ajax({
        url: "/TarefasAjax/ObterListas",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            if (result.length > 0) {
                $('#LstListas option').remove();
                $('#LstListas').append('<option value="">Escilha uma Lista</option>');
                //Popula os options com os valores retornados em JSON
                $.each(result, function (key, item) {
                    $('#LstListas').append('<option value="' + item.Id + '"> ' + item.Nome + '</option>');
                });
                if (id > 0) {
                    $('#LstListas').val(id);
                }
            }
            else {
                $('#LstListas option').remove();
                $('#LstListas').append('<option value="">Selecione uma Lista</option>');
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//Add Data Function 
function Add() {
    var res = validate();
    if (res === false) {
        return false;
    }
    var TarefaObj = {
        Id: $('#Id').val(),
        Titulo: $('#TxtTitulo').val(),
        Descricao: $('#TxtDescricao').val(),
        DataCriacao: $('#DpkDataCriacao').val(),
        DataConclusao: $('#DpkDataConclusao').val(),
        Completo: $('#chkConcluido').prop('checked'),
        IdLista: $('#LstListas').val()
    };
    $.ajax({
        url: "/TarefasAjax/Create",
        data: JSON.stringify(TarefaObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadData();
            $('#myModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//Function for getting the Data Based upon Employee ID
function getbyID(Id) {
    $('#TxtTitulo').css('border-color', 'lightgrey');
    $('#TxtDescricao').css('border-color', 'lightgrey');
    $('#DpkDataCriacao').css('border-color', 'lightgrey');
    $('#DpkDataConclusao').css('border-color', 'lightgrey');
    $('#LstListas').css('border-color', 'lightgrey');

    $.ajax({
        url: "/TarefasAjax/ObterTarefaPorId/" + Id,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#Id').val();
            $('#TxtTitulo').val(result.Titulo);
            $('#TxtDescricao').val(result.Descricao);
            $('#DpkDataCriacao').val(convertDate(result.DataCriacao));
            $('#DpkDataConclusao').val(result.DataConclusao);
            $('#chkConcluido').prop('checked', result.Conlcuido);
            $('#LstListas').val(result.IdLista);
            $('#myModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}

//function for updating employee's record
function Update() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var ListaObj = {
        Id: $('#Id').val(),
        Titulo: $('#TxtTitulo').val(),
        Descricao: $('#TxtDescricao').val(),
        DataCriacao: $('#DpkDataCriacao').val(),
        DataConclusao: $('#DpkDataConclusao').val(),
        Completo: $('#chkConcluido').prop('checked'),
        IdLista: $('#LstListas').val()
    };
    $.ajax({
        url: "/TarefasAjax/Edit",
        data: JSON.stringify(ListaObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadData();
            $('#myModal').modal('hide');
            $('#EmployeeID').val("");
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//function for deleting employee's record
function Delele(Id) {
    var ans = confirm("Tem certeza que deseja deletar essa Lista de Tarefas");
    if (ans) {
        $.ajax({
            url: "/TarefasAjax/Delete/" + Id,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                loadData();
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}

//Function for clearing the textboxes
function clearTextBox() {
    $('#Id').val("");
    $('#TxtTitulo').val("");
    $('#TxtObservacao').val("");
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $('#TxtTitulo').css('border-color', 'lightgrey');
    $('#TxtObservacao').css('border-color', 'lightgrey');
}
//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#TxtTitulo').val().trim() == "") {
        $('#TxtTitulo').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#TxtTitulo').css('border-color', 'lightgrey');
    }
    if ($('#TxtDescricao').val().trim() == "") {
        $('#TxtDescricao').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#TxtDescricao').css('border-color', 'lightgrey');
    }
    return isValid;
}