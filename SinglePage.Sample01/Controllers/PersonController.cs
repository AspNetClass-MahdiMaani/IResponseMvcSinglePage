using Microsoft.AspNetCore.Mvc;
using SinglePage.Sample01.ApplicationServices.Contracts;
using SinglePage.Sample01.ApplicationServices.Dtos.PersonDtos;
using SinglePage.Sample01.ApplicationServices.Services;
using SinglePage.Sample01.Models.DomainModels.PersonAggregates;
using System.Net;

namespace SinglePage.Sample01.Controllers
{
    public class PersonController : Controller
    {
        private readonly IPersonService _personService ;

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
        public async Task<IActionResult> Get(GetPersonServiceDto dto)
        {
            Guard_PersonService();
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
            var getDto = new GetPersonServiceDto()
            {
                Id = dto.Id
            };
            var getResponse= _personService.Get(getDto);
            if (ModelState.IsValid && getResponse!=null)
            {
                var deleteResponse = await _personService.Delete(dto);
                return Json(deleteResponse);
            }
            else
            {
                return BadRequest();
            }
        }
        #endregion

        #region [- Put() -]
        [HttpPut]
        public async Task<IActionResult> Put(PutPersonServiceDto dto)
        {
            Guard_PersonService();
            var putDto = new GetPersonServiceDto()
            {
                Id=dto.Id,
                FirstName=dto.FirstName,
                LastName=dto.LastName,
                Email = dto.Email
            };

            #region [- For checking & avoiding email duplication -]
            var getResponse = await _personService.Get(putDto);//For checking & avoiding email duplication
            switch (ModelState.IsValid)
            {
                case true when getResponse.Value is not null:
                    {
                        var putResponse = await _personService.Put(dto);
                        return Json(putResponse);
                    }
                case true when getResponse.Value is null://For checking & avoiding email duplication
                    return Conflict(dto);
                default:
                    return BadRequest();
            }
            #endregion
        }
        #endregion
    }
}
