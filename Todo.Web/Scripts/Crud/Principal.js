/// <reference path="../../moment.js" />
/// <reference path="../../jquery-3.3.1.intellisense.js" />
//Load Data in Table when documents is ready
$(document).ready(function () {
    loadData();
});

//Load Data function
function loadData() {
    $.ajax({
        url: "/ListasAjax/ObterListas",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, item) {
                html += '<tr>';
                html += '<td>' + item.Nome + '</td>';
                html += '<td>' + item.Observacao + '</td>';
                html += '<td><a href="#" onclick="return getbyIDLista(' + item.Id + ')">Editar</a> | <a href="#" onclick="Delele(' + item.Id + ')">Deletar</a> | <a href="#" onclick="loadTarefas(' + item.Id + ')">Tarefas</a> </td>';
                html += '</tr>';
            });
            $('#Listas').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//Carrega Tarefas
function loadTarefas(Id) {
    $.ajax({
        url: "/TarefasAjax/ObterTarefasLista/" + Id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, item) {
                html += '<tr>';
                html += '<td>' + item.Titulo + '</td>';
                html += '<td>' + item.Descricao + '</td>';
                html += '<td>' + moment(item.DataCriacao).format('DD/MM/YYYY') + '</td>';
                if (item.Completo) {
                    html += "<td><span class='glyphicon glyphicon-ok-circle'></td>";
                }
                else {
                    html += "<td><span class='glyphicon glyphicon-remove-circle'></td>";
                }
                html += '<td><a href="#" onclick="return getbyID(' + item.Id + ')">Editar</a> | <a href="#" onclick="Delele(' + item.Id + ')">Apagar</a></td>';
                html += '</tr>';
            });
            $('#Tarefas').html(html);
            $('#ModalTarefas').modal('show');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//Add Data Function 
function AddLista() {
    var res = validate();
    if (res === false) {
        return false;
    }
    var ListaObj = {
        Id: $('#Id').val(),
        Nome: $('#TxtNome').val(),
        Observacao: $('#TxtObservacao').val()
    };
    $.ajax({
        url: "/ListasAjax/Create",
        data: JSON.stringify(ListaObj),
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
function getbyIDLista(Id) {
    $('#TxtNome').css('border-color', 'lightgrey');
    $('#TxtObservacao').css('border-color', 'lightgrey');
    $.ajax({
        url: "/ListasAjax/ObterListarPorId/" + Id,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#TxtNome').val(result.Nome);
            $('#TxtObservacao').val(result.Observacao);
            $('#Id').val(result.Id);
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
function UpdateLista() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var ListaObj = {
        Id: $('#Id').val(),
        Nome: $('#TxtNome').val(),
        Observacao: $('#TxtObservacao').val()
    };
    $.ajax({
        url: "/ListasAjax/Edit",
        data: JSON.stringify(ListaObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadData();
            $('#myModal').modal('hide');
            $('#EmployeeID').val("");
            $('#Name').val("");
            $('#Age').val("");
            $('#State').val("");
            $('#Country').val("");
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
            url: "/ListasAjax/Delete/" + Id,
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
    $('#TxtNome').val("");
    $('#TxtObservacao').val("");
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $('#TxtNome').css('border-color', 'lightgrey');
    $('#TxtObservacao').css('border-color', 'lightgrey');
}
//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#TxtNome').val().trim() == "") {
        $('#TxtNome').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#TxtNome').css('border-color', 'lightgrey');
    }
    if ($('#TxtObservacao').val().trim() == "") {
        $('#TxtObservacao').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#TxtObservacao').css('border-color', 'lightgrey');
    }
    return isValid;
}