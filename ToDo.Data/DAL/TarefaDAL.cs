using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using ToDo.Data.Context;
using ToDo.Domain.Tarefas;

namespace ToDo.Data.DAL
{
    public class TarefaDAL
    {
        private ApplicationDbContext _context = new ApplicationDbContext();

        public IEnumerable ObterTarefas()
        {
            return _context.Tarefas.ToList();
        }

        public Tarefa ObterTarefaPorId(int? id)
        {
            return _context.Tarefas.FirstOrDefault(l => l.Id == id);
        }

        public List<Tarefa> ObterTarefasPorLista(int? id)
        {
            return _context.Tarefas.Where(l => l.IdLista == id).ToList();
        }

        public void GravarTarefa(Tarefa tarefa)
        {
            try
            {
                if (tarefa.Id == null)
                {
                    _context.Tarefas.Add(tarefa);
                }
                else
                {
                    _context.Entry(tarefa).State = EntityState.Modified;
                }
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        public Tarefa Deletar(int id)
        {
            Tarefa tarefa = ObterTarefaPorId(id);
            _context.Tarefas.Remove(tarefa);
            _context.SaveChanges();
            return tarefa;
        }
    }
}