using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToDo.Data.DAL;

namespace Todo.Web.Controllers
{
    public class ListasAjaxController : Controller
    {
        private ListaDAL _listaDal = new ListaDAL();

        // GET: ListasAjax
        public ActionResult Index()
        {
            if (Request.IsAjaxRequest())
            {
                return PartialView("~/Views/ListasAjax/_PartialTabelaLista.cshtml", _listaDal.ObterListas());
            }
            else
            {
                return View(_listaDal.ObterListas());
            }
        }
    }
}