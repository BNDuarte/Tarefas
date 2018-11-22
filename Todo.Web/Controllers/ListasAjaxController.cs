using System.Web.Mvc;
using ToDo.Data.DAL;
using ToDo.Domain.Listas;

namespace Todo.Web.Controllers
{
    [RoutePrefix("todo")]
    public class ListasAjaxController : Controller
    {
        private ListaDAL _listaDal = new ListaDAL();

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ObterListas()
        {
            return Json(_listaDal.ObterListas(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Create(Lista lista)
        {
            _listaDal.GravarLista(lista);
            return Json("ok",JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Edit(Lista lista)
        {
            _listaDal.GravarLista(lista);
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            Lista lista = _listaDal.Deletar(id);
            return Json("Ok", JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObterListarPorId(int? id)
        {
            Lista lista = _listaDal.ObterListaPorId(id);
            JsonResult jsonResult = Json(lista, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
    }
}