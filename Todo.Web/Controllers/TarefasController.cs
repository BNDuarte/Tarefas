using System.Web.Mvc;
using ToDo.Data.DAL;
using ToDo.Domain.Tarefas;

namespace Todo.Web.Controllers
{
    public class TarefasController : Controller
    {
        private TarefaDAL _tarefaDal = new TarefaDAL();
        private ListaDAL _listaDal = new ListaDAL();

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ObterTarefas()
        {
            var tarefas = _tarefaDal.ObterTarefas();
            return Json(tarefas, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObterTarefasLista(int id)
        {
            var tarefas = _tarefaDal.ObterTarefasPorLista(id);
            return Json(tarefas, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObterListas()
        {
            return Json(_listaDal.ObterListas(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Create(Tarefa tarefa)
        {
            _tarefaDal.GravarTarefa(tarefa);
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Edit(Tarefa tarefa)
        {
            _tarefaDal.GravarTarefa(tarefa);
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            Tarefa tarefa = _tarefaDal.Deletar(id);
            return Json("Ok", JsonRequestBehavior.AllowGet);
        }

        public JsonResult ObterTarefaPorId(int? id)
        {
            Tarefa tarefa = _tarefaDal.ObterTarefaPorId(id);
            JsonResult jsonResult = Json(tarefa, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }
    }
}