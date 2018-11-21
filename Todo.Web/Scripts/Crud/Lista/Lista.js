function criar_linha_grid(Dados) {
    var ret =
        '<tr data-id=' + Dados.Id + '>' +
        '<td>' + Dados.Nome + '</td>' +
        '<td>' + Dados.Observacao + '</td>' +
        '<td>' +
        '<a class="btn btn-success btn-excluir btn-sm" role="button" data-toggle="tooltip" data-placement="top" title="Adicionar"><i class="fa fa-plus"></i></a>' +
        '<a class="btn btn-success btn-alterar btn-sm" role="button" data-toggle="tooltip" data-placement="top" title="Alterar Grupo" style="margin-right: 3px"><i class="fa fa-pencil"></i></a>' +
        '<a class="btn btn-success btn-excluir btn-sm" role="button" data-toggle="tooltip" data-placement="top" title="Excluir Grupo"><i class="fa fa-trash"></i></a>' +
        '</td>' +
        '</tr>';

    return ret;
}

function CarregarGrupoProduto(idselecionar) {

    var btn = $(this),
        id = 0,
        url = urlgrupoproduto,
        param = { 'id': id };

    $.post(url, add_anti_forgery_token(param), function (response) {

        if (response.length > 0) {
            $('#lst_grupoproduto option').remove();
            $('#lst_grupoproduto').append('<option value="">Selecione um Grupo</option>');
            //Popula os options com os valores retornados em JSON
            for (var i = 0; i < response.length; i++) {
                $('#lst_grupoproduto').append('<option value="' + response[i].GrupoProdutoId + '"> ' + response[i].Nome + '</option>');
            }
            if (idselecionar > 0) {
                $('#lst_grupoproduto').val(idselecionar);
            }

        }
        else {
            $('#lst_grupoproduto option').remove();
            $('#lst_grupoproduto').append('<option value="">Selecione um Grupo</option>');
        }

    })
        .fail(function () {
            swal(
                'Ops, Algo Aconteceu :(',
                'Algum erro no momento da pesquisa de Grupo de Produtos, tente novamente daqui a pouco. :)',
                'warning'
            );
        });
}


function abrir(Dados, _titulo) {

    $("#CadEditLista").modal();

    $("#lst_grupoproduto").val(Dados.GrupoProdutoId);

    $('#Id').val(Dados.Id);

    $('#TxtNome').val(Dados.Nome);

    $('#TxtObservacao').val(Dados.Observacao);
}

$(document).ready(function () {

    var modal_cadastro = $('#modal_cadastro');

    $("#BtnIncluir").click(function () {
        abrir({}, 'Inclusão de Lista');
    });

    //$(document).on('click', '.btn-alterar', function () {
    $("#BtnAlterar").click(function () {
        var btn = $(this),
            id = btn.closest('tr').attr('data-id'),
            url = urlEdit,
            param = { 'id': id };


        $.post(url, add_anti_forgery_token(param), function (response) {
            if (response) {
                abrir(response, 'Alteração Listas');
            }
        })
            .fail(function () {
                swal(
                    'Ops, Algo Aconteceu :(',
                    'Algum erro no momento da gravação das suas alterações, tente novamente daqui a pouco. :)',
                    'warning'
                );
            });

    });

    $(document).on('click', '.btn-excluir', function () {

        var btn = $(this),
            tr = btn.closest('tr'),
            id = tr.attr('data-id'),
            url = urlexclusao,
            param = { 'id': id };

        swal({
            title: 'Confirma a Exclusão?',
            text: 'Caso confirme, a exclusão será definitiva.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, quero deletar!',
            cancelButtonText: 'Não'
        }).then((result) => {
            if (result.value) {
                $.post(url, add_anti_forgery_token(param), function (response) {
                    if (response.Resultado === "OK") {
                        tr.remove();
                        var quant = $('#grid_cadastro > tbody > tr').length;
                        if (quant === 0) {
                            $('#grid_cadastro').addClass('Ocultar');
                            $('#mensagem_grid').removeClass('Ocultar');
                        }
                        swal({
                            position: 'top-end',
                            type: 'success',
                            title: 'Operação efetuada com Sucesso',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    else if (response.Resultado === "ERRO") {
                        formatar_mensagens_aviso(response.Mensagens, response.Resultado);
                    }
                    else if (response.Resultado === "AVISO") {
                        formatar_mensagens_aviso(response.Mensagens, response.Resultado);

                    }
                })
                    .fail(function () {
                        swal(
                            'Ops, Algo Aconteceu :(',
                            'Algum erro no momento da exclusão, este item que você está tentando excluir pode estar vinculado a algum outro registro do sistema, ou ser o único com perfil de administrador.',
                            'warning'
                        );
                    });
            }
        });

    });


    $("#btn_confirmar").click(function () {

        var btn = $(this),
            url = urlcadastro,
            param = {
                ProdutoId: $('#id_produto').val(),
                GrupoProdutoId: $('#lst_grupoproduto').val(),
                Nome: $('#txt_nome').val(),
                NomeCardapio: $('#txt_nomecardapio').val(),
                DescricaoCardapio: $('#txt_descricaocardapio').val(),
                Preco: $('#txt_preco').val(),
                Ativo: $('#chk_ativo').prop('checked'),
                QuantidadeFracionada: $('#chk_quantidadefracionadaativo').prop('checked'),
                AceitaOpcionais: $('#chk_aceitaopcionaisativo').prop('checked'),
            };

        var linha;
        var msg_resposta;
        $.post(url, add_anti_forgery_token(param), function (response) {
            if (response.ProdutoId > 0) {
                if (param.ProdutoId === 0 || param.ProdutoId === "") {
                    param.ProdutoId = response.IdSalvo;
                    var table = $('#grid_cadastro').find('tbody');
                    linha = criar_linha_grid(response);
                    table.append(linha);
                    msg_resposta = "Inclusão efetuada com sucesso.";
                }
                else {
                    linha = $('#grid_cadastro').find('tr[data-id=' + response.ProdutoId + ']').find('td');
                    var cl_id = '<div class="rounded bg-info small" align="center" style="color:whitesmoke">' + response.ProdutoId + '</div>';
                    linha.eq(0).html(cl_id).end();
                    linha.eq(1).html(response.Nome).end();
                    linha.eq(2).html(response.Preco).end();
                    var cl_status = param.Ativo ? 'Ativo' : 'Desativado';
                    linha.eq(3).html('<span class="badge badge-primary">' + cl_status + '</span>').end();
                    var cl_status = param.QuantidadeFracionada ? 'Ativo' : 'Desativado';
                    linha.eq(4).html('<span class="badge badge-primary">' + cl_status + '</span>').end();
                    var cl_status = param.AceitaOpcionais ? 'Ativo' : 'Desativado';
                    linha.eq(5).html('<span class="badge badge-primary">' + cl_status + '</span>').end();
                    msg_resposta = "Alteração efetuada com sucesso.";
                }
                $('#telacadastroproduto').modal('hide');
                swal({
                    position: 'top-end',
                    type: 'success',
                    title: msg_resposta,
                    showConfirmButton: false,
                    timer: 1500
                })


            }
            else if (response.Resultado === "ERRO") {
                formatar_mensagens_aviso(response.Mensagens, response.Resultado);
            }
            else if (response.Resultado === "AVISO") {
                formatar_mensagens_aviso(response.Mensagens, response.Resultado);

            }

        })
            .fail(function () {
                swal(
                    'Ops, Algo Aconteceu :(',
                    'Algum erro no momento da gravação das suas alterações, tente novamente daqui a pouco. :)',
                    'warning'
                );
            });

    });

});
