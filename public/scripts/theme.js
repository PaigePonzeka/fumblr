$(document).ready(function() {
  generateIndex();

  $('.box').live('hover', function(){
    $(this).find('.titlebar').toggleClass('hide');
  });

  $('.box').live('click', function(){
    $(this).toggleClass('box_large');
    $('#posts_list').isotope( 'reLayout');
    false
  });

});


$(window).load(function(){
  intializeIsotope();
});

function intializeIsotope()
{
  $('#posts_list').isotope({
    itemSelector : '.box',
    getSortData : {
      tag : function( $elem ) {
        return $elem.attr('data-tags');
      }
    }
  });

  // Sorting elements by tag
  //$('#posts_list').isotope({ sortBy : 'tag' });
  // Filter posts by tag
  //$('#posts_list').isotope({ filter: '.photo' });

}


// HELPER - removes images and titles from text and returns the excerpt
function processText(text)
{
  text = text.replace(/<img[^>]+\>/g, '').replace(/<h2>[^>]+<\/h2>/g, '');
  return $('<div/>').html(text).text();
}


// parses and formats the data given by the tumblr api request (expected format = "2011-09-14 19:59:00 GMT")
function formatDate(date){
  var year_month_day = date.split(" ")[0].split('-');
  month_string = "";
  switch (parseInt(year_month_day[1].replace(/^[0]+/g,"")))
  {
    case 1:
      month_string = "Jan";
      break;
    case 2:
      month_string = "Feb";
      break;
    case 3:
      month_string = "Mar";
      break;
    case 4:
      month_string = "Apr";
      break;
    case 5:
      month_string = "May";
      break;
    case 6:
      month_string = "June";
      break;
    case 7:
      month_string = "July";
      break;
    case 8:
      month_string = "Aug";
      break;
    case 9:
      month_string = "Sept";
      break;
    case 10:
      month_string = "Oct";
      break;
    case 11:
      month_string = "Nov";
      break;
    case 12:
      month_string = "Dec";
      break;
  }
  return month_string + " "+ year_month_day[2];
}


// get Index page data and categories
function generateIndex() {
  var posts_url = "http://api.tumblr.com/v2/blog/hello.ponzeka.com/posts?api_key=4dxnMh8zezG5fq2OK0vwVhusWboTW4SSA4g3JUgJJ55b1QE7Jz&callback&jsonp=?";
  $.getJSON(posts_url, function(data) {
    // get the first 15 posts
    $(data.response.posts).each(function(index) {
      if (index > 15)
        return;
      // get the post type
      var post_type = this.type;
      // get post tags (array)
      var post_tags = this.tags

      // get post note count
      var post_note_count = this.note_count

      var preview_content;
      // process each post depending on type
      var preview_titlebar = $('<div />', { class: "titlebar" } );
      var preview_titlebar_date = $('<p />', { text: formatDate(this.date), class: "date"});
      var preview_titlebar_note = $('<p />', { text: this.note_count, class: "note"});
      preview_titlebar.append(preview_titlebar_date).append(preview_titlebar_note).addClass('hide');

      switch(post_type)
      {
        case "text":
          $('#posts_list').append(generateTextPreview(this).addClass('box_color1').attr('data-tag',post_type).append(preview_titlebar));
          break;
        case "photo":
          $('#posts_list').append(generatePhotoPreview(this).addClass('box_color2').append(preview_titlebar));
          break;
        case "link":
          $('#posts_list').append(generateLinkPreview(this).addClass('box_color3').append(preview_titlebar));
          break;
        case "quote":
          $('#posts_list').append(generateQuotePreview(this).addClass('box_color4').append(preview_titlebar));
          break;
        default:
          console.log("Error: Unsupported Post type: " + post_type);
      }
    });
  });
} // end of generateIndex Method


// processes a text preview, takes a post object
function generateTextPreview(post)
{
  // convert the post data to html
  var preview_content = "";
  var text_post_title = $('<h3 />', { text: post.title });
  var text_post_body = $('<p />', { text: processText(post.body).substring(0, 300) });
  var text_post_url = $('<a />', { href: post.post_url});

  preview_container = generatePreviewContainer(post.type);
  return preview_container.append(text_post_url.html(text_post_title));
}


// process a photo preview, takes a post object
function generatePhotoPreview(post)
{
  var preview_post_photo = $('<img />', { src: post.photos[0].alt_sizes[0].url });
  var preview_post_caption = $('<p />', { text: post.caption });
  var preview_post_url = $('<a />', { href: post.post_url });

  post_container = generatePreviewContainer(post.type);
  return post_container.append(preview_post_photo);
}


// process a quote preview, takes a post object
function generateQuotePreview(post)
{
  var preview_post_caption = $('<h3 />', { text: processText(post.text)});
  var preview_post_url = $('<a />', { href: post.post_url });

  post_container = generatePreviewContainer(post.type);
  return post_container.append( preview_post_caption);
}


// process a link preview, takes a post object
function generateLinkPreview(post)
{
  var preview_post_description = $('<h3 />', { text: processText(post.title)});
  var preview_post_url = $('<a />', { href: post.post_url });

  post_container = generatePreviewContainer(post.type);
  return post_container.append( preview_post_description);
}


// returns the div to contain the preview boxes on the front page
function generatePreviewContainer(type)
{
  var post = $('<div />', { class: "box" });
  // add class for each tag
  post.addClass(type);
  return post;
}


/*******************************************************
* currently unsupported post types = chat, audio, video
*******************************************************/

