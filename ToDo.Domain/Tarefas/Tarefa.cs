using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using ToDo.Domain.Listas;

namespace ToDo.Domain.Tarefas
{
    public class Tarefa
    {
        public int? Id { get; set; }
        [DisplayName("Título")]
        [Required(ErrorMessage = "Informe o Título")]
        public string Titulo { get; set; }
        [DisplayName("Descrição")]
        public string Descricao { get; set; }
        [DisplayName("Data de Cadastro")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime? DataCriacao { get; set; }
        [DisplayName("Data de Conclusão")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime? DataConclusao { get; set; }
        [DisplayName("Tarefa Completa")]
        public bool Completo { get; set; }
        [DisplayName("Lista de Tarefa")]
        public int IdLista { get; set; }
        public virtual Lista Lista { get; set; }
    }
}
