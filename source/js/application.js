// Instantiate an empty object.
var Instagram = {};

// Small object for holding important configuration data.
Instagram.Config = {
  clientID: 'f4707a3123444aef84086b285e1d7538',
  apiHost: 'https://api.instagram.com'
};


// ************************
// ** Main Application Code
// ************************
(function(){
  var photoTemplate, resource;

  function init(){
    bindEventHandlers();
    photoTemplate = _.template($('#photo-template').html());
  }

  function toTemplate(photo){
    photo = {
	  	
      count: photo.likes.count,
      avatar: photo.user.profile_picture,
      photo: photo.images.standard_resolution.url,
	  user: photo.user.username,
	  comment: photo.comments.count,
	  caption: (photo.caption ? photo.caption.text: ""), 
      url: photo.link
    };
	
    return photoTemplate(photo);
  }

  function toScreen(photos){
    var photos_html = '';

    $('.paginate a').attr('data-max-tag-id', photos.pagination.next_max_id)
                    .fadeIn(1000);

    $.each(photos.data, function(index, photo){
      photos_html += toTemplate(photo);
    });

    $('div#photos-wrap').append(photos_html);
  }
// Gets text value from link and searches it
	$('a.yourLink').click(function(e) 
	  {
		  var tag = $(e.target).text();
		  if(tag){
			  search(tag);
		  }
		 
	  });
//  function searchLink() {
//	  $('a.yourLink').click(function(e){
//		  var tag = $(e.target).text();
//		  if(tag){
//			  Instagram.App.search(tag);
//
//		  }
//	  });
//  }
  function generateResource(tag){
    var config = Instagram.Config, url;

    if(typeof tag === 'undefined'){
      throw new Error("Resource requires a tag. Try searching for cats.");
    } else {
      // Make sure tag is a string, trim any trailing/leading whitespace and take only the first 
      // word, if there are multiple.
      tag = String(tag).trim().split(" ")[0];
    }

    url = config.apiHost + "/v1/tags/" + tag + "/media/recent?callback=?&client_id=" + config.clientID;

    return function(max_id){
      var next_page;
      if(typeof max_id === 'string' && max_id.trim() !== '') {
        next_page = url + "&max_id=" + max_id;
      }
      return next_page || url;
    };
  }

  function paginate(max_id){    
    $.getJSON(generateUrl(tag), toScreen);
  }

  function search(tag){
    resource = generateResource(tag);
    $('.paginate a').hide();
    $('#photos-wrap *').remove();
    fetchPhotos();
  }

  function fetchPhotos(max_id){
    $.getJSON(resource(max_id), toScreen);
  }

  function bindEventHandlers(){
    $('body').on('click', '.paginate a.btn', function(){
      var tagID = $(this).attr('data-max-tag-id');
      fetchPhotos(tagID);
      return false;
    });

    // Bind an event handler to the `submit` event on the form
	$('form').on('submit', function(e){

      // Stop the form from fulfilling its destinty.
      e.preventDefault();

      // Extract the value of the search input text field.
      var tag = $('input.search-tag').val().trim();

      // Invoke `search`, passing `tag` (unless tag is an empty string).
      if(tag) {
        search(tag);
		$(this).parent('#splashsearch').fadeOut(1000);
      };

    });

  }  
  


  function showPhoto(p){
    $(p).fadeIn();
  }

  // Public API
  Instagram.App = {
    search: search,
    showPhoto: showPhoto,
    init: init
  };
}());

$(function(){
	
  Instagram.App.init();
  
  // Start with a search on cats; we all love cats.
  Instagram.App.search('famouslandmark');  
  
//   $('a.yourLink').click(function(e)
//					  {
//						  var tag = $(e.target).text();
//						  if(tag){
//							  Instagram.App.search(tag);
//						  }
//						 
//					  });

});

