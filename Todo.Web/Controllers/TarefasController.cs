using System;
using System.Net;
using System.Web.Mvc;
using ToDo.Data.DAL;
using ToDo.Domain.Tarefas;

namespace Todo.Web.Controllers
{
    public class TarefasController : Controller
    {
        private TarefaDAL _tarefaDal = new TarefaDAL();
        private ListaDAL _listaDAL = new ListaDAL();
        // GET: Tarefas
        public ActionResult Index()
        {
            return View(_tarefaDal.ObterTarefas());
        }

        public ActionResult Create()
        {
            PopularViewBag();
            return View(new Tarefa());
        }

        [HttpPost]
        public ActionResult Create(Tarefa tarefa)
        {
            return GravarTarefa(tarefa);
        }

        public ActionResult Edit(int? id)
        {
            PopularViewBag(_tarefaDal.ObterTarefaPorId(id));
            return ObterTarefaPorId(id);
        }

        [HttpPost]
        public ActionResult Edit(Tarefa tarefa)
        {
            return GravarTarefa(tarefa);
        }

        public ActionResult Details(int? id)
        {
            PopularViewBag(_tarefaDal.ObterTarefaPorId(id));
            return ObterTarefaPorId(id);
        }

        public ActionResult Delete(int? id)
        {
            return ObterTarefaPorId(id);
        }

        [HttpPost]
        public ActionResult Delete(int id)
        {
            try
            {
                Tarefa tarefa = _tarefaDal.Deletar(id);
                TempData["Message"] = "Lista " + tarefa.Titulo.ToUpper() + " foi removida";
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public ActionResult GravarTarefa(Tarefa tarefa)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _tarefaDal.GravarTarefa(tarefa);
                    return RedirectToAction("Index");
                }
                return View(tarefa);
            }
            catch (Exception ex)
            {
                return View(tarefa);
            }
        }

        private ActionResult ObterTarefaPorId(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Tarefa tarefa = _tarefaDal.ObterTarefaPorId(id);
            if (tarefa == null)
            {
                return HttpNotFound();
            }
            return View(tarefa);
        }

        private void PopularViewBag(Tarefa tarefa = null)
        {
            if (tarefa == null)
            {
                ViewBag.ListaId = new SelectList(_listaDAL.ObterListasPorNome(), "Id", "Nome");
            }
            else
            {
                ViewBag.ListaId = new SelectList(_listaDAL.ObterListasPorNome(), "Id", "Nome", tarefa.Id);
            }
        }
    }
}
