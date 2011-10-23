$(document).ready(function() {
  generateIndex();

});


$(window).load(function(){
  intializeIsotope();
});

function intializeIsotope()
{
  $('#posts_list').isotope({
    itemSelector : '.box'
  });
}


// HELPER - removes images and titles from text and returns the excerpt
function processText(text)
{
  text = text.replace(/<img[^>]+\>/g, '').replace(/<h2>[^>]+<\/h2>/g, '');
  return $('<div/>').html(text).text();
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
      // get post date
      var post_date = this.date
      // get post tags (array)
      var post_tags = this.tags

      // get post note count
      var post_note_count = this.note_count

      var preview_content;
      // process each post depending on type
      switch(post_type)
      {
        case "text":
          $('#posts_list').append(generateTextPreview(this).addClass('box_color1'));
          break;
        case "photo":
          $('#posts_list').append(generatePhotoPreview(this).addClass('box_color2'));
          break;
        case "link":
          $('#posts_list').append(generateLinkPreview(this).addClass('box_color3'));
          break;
        case "quote":
          $('#posts_list').append(generateQuotePreview(this).addClass('box_color4'));
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

  preview_container = generatePreviewContainer(preview_content);
  return preview_container.append(text_post_url.html(text_post_title));
}


// process a photo preview, takes a post object
function generatePhotoPreview(post)
{
  var preview_post_photo = $('<img />', { src: post.photos[0].alt_sizes[0].url });
  var preview_post_caption = $('<p />', { text: post.caption });
  var preview_post_url = $('<a />', { href: post.post_url });

  post_container = generatePreviewContainer();
  return post_container.append(preview_post_url.html(preview_post_photo));
}


// process a quote preview, takes a post object
function generateQuotePreview(post)
{
  var preview_post_caption = $('<h3 />', { text: processText(post.text)});
  var preview_post_url = $('<a />', { href: post.post_url });

  post_container = generatePreviewContainer();
  return post_container.append( preview_post_url.html(preview_post_caption));
}


// process a link preview, takes a post object
function generateLinkPreview(post)
{
  var preview_post_description = $('<h3 />', { text: processText(post.title)});
  var preview_post_url = $('<a />', { href: post.post_url });

  post_container = generatePreviewContainer();
  return post_container.append( preview_post_url.html(preview_post_description));
}


// returns the div to contain the preview boxes on the front page
function generatePreviewContainer()
{
  var post = $('<div />', { class: "box"});
  return post;
}


/*******************************************************
* currently unsupported post types = chat, audio, video
*******************************************************/

