/// <reference path="../../moment.js" />
/// <reference path="../../jquery-3.3.1.intellisense.js" />
//Load Data in Table when documents is ready
$(document).ready(function () {
    loadData();
    
});

function convertDate(date) {
    if (date != null) {
        return new Date(parseInt(date.replace("/Date(", "").replace(")/", ""), 10));
    }
    else {
        return null;
    }
}

function loadLista(id) {
    $.ajax({
        url: "/Tarefas/ObterListas",
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
            $('#LstListas').prop("disabled", true);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//Load Data function
function loadData() {
    $.ajax({
        url: "/Listas/ObterListas",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, item) {
                html += '<tr>';
                html += '<td>' + item.Nome + '</td>';
                html += '<td>' + item.Observacao + '</td>';
                html += '<td><a href="#" onclick="return getbyIDLista(' + item.Id + ')">Editar</a> | <a href="#" onclick="DeleleLista(' + item.Id + ')">Deletar</a> | <a href="#" onclick="loadTarefas(' + item.Id + ')">Tarefas</a> </td>';
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
        url: "/Tarefas/ObterTarefasLista/" + Id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $('#IdLista').val(Id);
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
                html += '<td><a href="#" onclick="return getTarefa(' + item.Id + ')">Editar</a> | <a href="#" onclick="DeleleTarefa(' + item.Id + ')">Apagar</a></td>';
                html += '</tr>';
            });
            $('#Tarefas').html(html);
            loadLista(Id);
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
        url: "/Listas/Create",
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

//Add Tarefa
function AddTarefa() {
    var res = validateTarefa();
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
        url: "/Tarefas/Create",
        data: JSON.stringify(TarefaObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadTarefas($('#IdLista').val());
            $('#CadTarefa').modal('hide');
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
        url: "/Listas/ObterListarPorId/" + Id,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#TxtNome').val(result.Nome);
            $('#TxtObservacao').val(result.Observacao);
            $('#Id').val(result.Id);
            $('#myModal').modal('show');
            $('#btnUpdateLista').show();
            $('#btnAddLista').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}

function getTarefa(Id) {
    $('#TxtTitulo').css('border-color', 'lightgrey');
    $('#TxtDescricao').css('border-color', 'lightgrey');
    $('#DpkDataCriacao').css('border-color', 'lightgrey');
    $('#DpkDataConclusao').css('border-color', 'lightgrey');
    $('#LstListas').css('border-color', 'lightgrey');

    $.ajax({
        url: "/Tarefas/ObterTarefaPorId/" + Id,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#Id').val(result.Id);
            $('#TxtTitulo').val(result.Titulo);
            $('#TxtDescricao').val(result.Descricao);
            $('#DpkDataCriacao').val(moment(convertDate(result.DataCriacao)).format('YYYY-MM-DD'));
            $('#DpkDataConclusao').val(moment(convertDate(result.DataConclusao)).format('YYYY-MM-DD'));
            $('#chkConcluido').prop('checked', result.Conlcuido);
            $('#LstListas').val(result.IdLista);
            $('#LstListas').prop("disabled", true);
            $('#CadTarefa').modal('show');
            $('#btnUpdateTarefa').show();
            $('#btnAddTarefa').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}

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
        url: "/Listas/Edit",
        data: JSON.stringify(ListaObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadData();
            $('#myModal').modal('hide');
            LimpaCamposLista();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function UpdateTarefa() {
    var res = validateTarefa();
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
        url: "/Tarefas/Edit",
        data: JSON.stringify(ListaObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadTarefas($('#LstListas').val());
            $('#CadTarefa').modal('hide');
            LimpaCamposTarefa();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//function for deleting employee's record
function DeleleLista(Id) {
    var ans = confirm("Tem certeza que deseja deletar essa Lista de Tarefas");
    if (ans) {
        $.ajax({
            url: "/Listas/Delete/" + Id,
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

function DeleleTarefa(Id) {
    var ans = confirm("Tem certeza que deseja deletar essa Tarefas");
    if (ans) {
        $.ajax({
            url: "/Tarefas/Delete/" + Id,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                loadTarefas($('#IdLista').val());
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}

//Function for clearing the textboxes
function LimpaCamposLista() {
    $('#Id').val("");
    $('#TxtNome').val("");
    $('#TxtObservacao').val("");
    $('#btnUpdateLista').hide();
    $('#btnAddLista').show();
    $('#TxtNome').css('border-color', 'lightgrey');
    $('#TxtObservacao').css('border-color', 'lightgrey');
}

function LimpaCamposTarefa() {
    $('#Id').val("");
    $('#TxtTitulo').val("");
    $('#TxtDescricao').val("");
    $('#TxtDescricao').val("");
    $('#DpkDataCriacao').val("");
    $('#DpkDataConclusao').val("");
    $('#chkConcluido').val("");
    $('#btnUpdateTarefa').hide();
    $('#btnAddTarefa').show();
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

function validateTarefa() {
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