using System;
using System.Net;
using System.Web.Mvc;
using ToDo.Data.DAL;
using ToDo.Domain.Listas;

namespace Todo.Web.Controllers
{
    public class ListasController : Controller
    {
        private ListaDAL _listaDal = new ListaDAL();

        // GET: Tarefas
        public ActionResult Index()
        {
            return View(_listaDal.ObterListas());
        }

        public ActionResult Create()
        {
            return View(new Lista());
        }

        [HttpPost]
        public ActionResult Create(Lista lista)
        {
            return GravarLista(lista);
        }

        public ActionResult Edit(int? id)
        {
            return ObterListarPorId(id);
        }

        [HttpPost]
        public ActionResult Edit(Lista lista)
        {
            return GravarLista(lista);
        }

        public ActionResult Details(int? id)
        {
            return ObterListarPorId(id);
        }

        public ActionResult Delete(int? id)
        {
            return ObterListarPorId(id);
        }

        [HttpPost]
        public ActionResult Delete(int id)
        {
            try
            {
                Lista lista = _listaDal.Deletar(id);
                TempData["Message"] = "Lista " + lista.Nome.ToUpper() + " foi removida";
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        public ActionResult GravarLista(Lista lista)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _listaDal.GravarLista(lista);
                    return RedirectToAction("Index");
                }
                return View(lista);
            }
            catch (Exception ex)
            {
                return View(lista);
            }
        }

        private ActionResult ObterListarPorId(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Lista lista = _listaDal.ObterListaPorId(id);
            if (lista == null)
            {
                return HttpNotFound();
            }
            return View(lista);
        }
    }
}
