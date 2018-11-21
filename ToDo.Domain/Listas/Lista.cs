using System.Collections.Generic;
using ToDo.Domain.Tarefas;

namespace ToDo.Domain.Listas
{
    public class Lista
    {
        public int? Id { get; set; }
        public string Nome { get; set; }
        public string Observacao { get; set; }

        public virtual ICollection<Tarefa> Tarefas { get; set; }
    }
}