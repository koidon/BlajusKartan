using AutoMapper;
using Backend.Dtos;
using Backend.Models;

namespace Backend;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Models.Location, Dtos.Location>();

        CreateMap<PoliceEvent, PoliceEventDto>()
            .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location));;
    }
}