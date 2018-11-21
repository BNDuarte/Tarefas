using System.Collections;
using System.Data.Entity;
using System.Linq;
using ToDo.Data.Context;
using ToDo.Domain.Listas;

namespace ToDo.Data.DAL
{
    public class ListaDAL
    {
        private ApplicationDbContext _context = new ApplicationDbContext();

        public IEnumerable ObterListas()
        {
            return _context.Listas.ToList();
        }

        public IEnumerable ObterListasPorNome()
        {
            return _context.Listas.OrderBy(l => l.Nome).ToList();
        }

        public Lista ObterListaPorId(int? id)
        {
            return _context.Listas.FirstOrDefault(l => l.Id == id);
        }

        public void GravarLista(Lista lista)
        {
            if (lista.Id == null)
            {
                _context.Listas.Add(lista);
            }
            else
            {
                _context.Entry(lista).State = EntityState.Modified;
            }
            _context.SaveChanges();
        }

        public Lista Deletar(int id)
        {
            Lista lista = ObterListaPorId(id);
            _context.Listas.Remove(lista);
            _context.SaveChanges();
            return lista;
        }
    }
}
