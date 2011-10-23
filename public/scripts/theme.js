$(document).ready(function() {
  console.log("Loaded");
  generateIndex();
});

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
    // get the first 10 posts
    $(data.response.posts).each(function(index) {
      // get the post type
      var post_type = this.type;
      // get post url
      var post_url = this.post_url
      // get post date
      var post_date = this.date
      // get post tags (array)
      var post_tags = this.tags

      // get post note count
      var post_note_count = this.note_count

      var preview_content;
      // process each post depending on type
      console.log(post_type);
      switch(post_type)
      {
        case "text":
          $('#posts_list').append(generateTextPreview(this));
          break;
        case "photo":
          $('#posts_list').append(generatePhotoPreview(this));
          break;
        case "link":
          $('#posts_list').append(generateLinkPreview(this));
          break;
        case "quote":
          $('#posts_list').append(generateQuotePreview(this));
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
  // get the post data
  var post_title = post.title
  var post_note_count = post.note_count
  var post_body = post.body

  // convert the post data to html
  var preview_content = "";
  var text_post_title = $('<h3 />', { text: post_title });
  var text_post_body = $('<p />', { text: processText(post_body).substring(0, 300) });
  preview_container = generatePreviewContainer(preview_content);

  return preview_container.append(text_post_title).append(text_post_body);
}


// process a photo preview, takes a post object
function generatePhotoPreview(post)
{
  var post_caption = post.caption
  var post_photos = post.photos

  post_container = generatePreviewContainer();
  var preview_post_photo = $('<img />', { src: post_photos[0].alt_sizes[0].url });
  var preview_post_caption = $('<p />', { text: post_caption});

  return post_container.append(post_caption).append(preview_post_photo);
}


// process a quote preview, takes a post object
function generateQuotePreview(post)
{
  var post_text = post.text;

  var preview_post_caption = $('<p />', { text: processText(post_text)});
  post_container = generatePreviewContainer();

  return post_container.append(preview_post_caption);
}


// process a link preview, takes a post object
function generateLinkPreview(post)
{
  var post_description = post.description;

  post_container = generatePreviewContainer();
  var preview_post_description = $('<p />', { text: processText(post_description)});

  return post_container.append(preview_post_description);
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

