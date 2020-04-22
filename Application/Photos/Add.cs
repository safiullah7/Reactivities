using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Photo>
        {
            public IFormFile File { get; set; }
        }
        public class Handler : IRequestHandler<Command, Photo>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
                _context = context;
            }

            async Task<Photo> IRequestHandler<Command, Photo>.Handle(Command request, CancellationToken cancellationToken)
            {
                // handler logic
                var photoUploadResult = _photoAccessor.AddPhoto(request.File);
                var user = _context.Users.SingleOrDefault(x => x.UserName == _userAccessor.GetCurrentUsername());
                var photo = new Photo
                {
                    Id = photoUploadResult.PublicId,
                    Url = photoUploadResult.Url
                };

                if (!user.Photos.Any(x => x.IsMain))
                    photo.IsMain = true;

                user.Photos.Add(photo); // will save in photo table as well

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return photo;
                throw new Exception("Problem saving activity");
            }
        }
    }
}