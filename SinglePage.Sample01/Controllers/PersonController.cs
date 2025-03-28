using Microsoft.AspNetCore.Mvc;
using SinglePage.Sample01.ApplicationServices.Contracts;
using SinglePage.Sample01.ApplicationServices.Dtos.PersonDtos;

namespace SinglePage.Sample01.Controllers
{
    public class PersonController : Controller
    {
        private readonly IPersonService _personService;

        #region [- ctor -]
        public PersonController(IPersonService personService)
        {
            _personService = personService;
        }
        #endregion

        #region [- Index() -]
        public IActionResult Index()
        {
            return View();
        }
        #endregion

        #region [- GetAll() -]
        public async Task<IActionResult> GetAll()
        {
            Guard_PersonService();
            var getAllResponse = await _personService.GetAll();
            var response = getAllResponse.Value.GetPersonServiceDtos;
            return Json(response);
        }
        #endregion

        #region [- Get() -]
        public async Task<IActionResult> Get(Guid id)
        {
            Guard_PersonService();
            var dto = new GetPersonServiceDto() { Id = id };
            var getResponse = await _personService.Get(dto);
            var response = getResponse.Value;
            if (response is null)
            {
                return Json("NotFound");
            }
            return Json(response);
        }
        #endregion

        #region [- Post() -]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PostPersonServiceDto dto)
        {
            Guard_PersonService();
            var postedDto = new GetPersonServiceDto() { Email = dto.Email };
            var getResponse = await _personService.Get(postedDto);

            if (ModelState.IsValid && getResponse.Value is null)
            {
                var postResponse = await _personService.Post(dto);
                return postResponse.IsSuccessful ? Ok() : BadRequest();
            }
            else if (ModelState.IsValid && getResponse.Value is not null)
            {
                return Conflict(dto);
            }
            else
            {
                return BadRequest();
            }
        }
        #endregion

        #region [- PersonServiceGuard() -]
        private ObjectResult Guard_PersonService()
        {
            if (_personService is null)
            {
                return Problem($" {nameof(_personService)} is null.");
            }

            return null;
        }
        #endregion

        #region [- Delete() -]
        [HttpPost]
        public async Task<IActionResult> Delete([FromBody] DeletePersonServiceDto dto)
        {
            Guard_PersonService();
            var deleteResponse = await _personService.Delete(dto);
            return deleteResponse.IsSuccessful ? Ok() : BadRequest();
        }
        #endregion

        #region [- Put() -]
        [HttpPost]
        public async Task<IActionResult> Put([FromBody] PutPersonServiceDto dto)
        {
            Guard_PersonService();
            var putDto = new GetPersonServiceDto() { Email = dto.Email };

            #region [- For checking & avoiding email duplication -]
            //var getResponse = await _personService.Get(putDto);//For checking & avoiding email duplication
            //switch (ModelState.IsValid)
            //{
            //    case true when getResponse.Value is null:
            //    {
            //        var putResponse = await _personService.Put(dto);
            //        return putResponse.IsSuccessful ? Ok() : BadRequest();
            //    }
            //    case true when getResponse.Value is not null://For checking & avoiding email duplication
            //        return Conflict(dto);
            //    default:
            //        return BadRequest();
            //} 
            #endregion

            if (ModelState.IsValid)
            {
                var putResponse = await _personService.Put(dto);
                return putResponse.IsSuccessful ? Ok() : BadRequest();
            }
            else
            {
                return BadRequest();
            }
        }
        #endregion
    }
}
