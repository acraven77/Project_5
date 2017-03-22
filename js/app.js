/* ================================================================
Notes
================================================================ */

//Went for exceeds expectations on this project. I have commented where the
//exceeds expectations code is. Also I tried to use as much vanilla JS that
//I could just for practice. Thanks for reviewing!

/* ================================================================
Notes
================================================================ */




//IIFE to not create global variables and keep variables private.
(function() {


'use strict'


//Prevent form submit default action and call main formSubmit function.
document.getElementsByClassName('search-form')[0].addEventListener('submit', function(event){
  event.preventDefault();
  formSubmit();
});


//Main form submit function that makes the ajax call to spotify.
function formSubmit() {
  var html = '';
  var searchInput = $('#search').val();
  var url = "https://api.spotify.com/v1/search?";
  var options = {
                  "q" : searchInput,
                  "type" : "album"
                };
  var mainList = document.getElementById('albums');
  var listItems = document.getElementsByTagName('li');
  var albumDetailsPage = document.getElementById('album-details-page');
  var mainBody = document.querySelector('body');


    //If the main UL has been removed because an album has already been searched (and removed) it is replaced.
    if (!mainList) {
      mainBody.removeChild(albumDetailsPage);
      html += '<div class="main-content clearfix">';
      html += '<ul id="albums" class="album-list"><li class="desc">';
      html += '<i class="material-icons icn-album">album</i>Search for your favorite albums!</li>';
      html += '</ul></div>';
      $('body').append(html);
    }

    //If there are 'li's' on the page this will remove all from the main UL
    //making room for the new searched items.
    if (listItems.length >= 1) {
      while (document.getElementById('albums').firstChild) {
        document.getElementById('albums').removeChild(document.getElementById('albums').firstChild);
      }
    }

    //If there is no search term entered a message will be displayed to the user.
    if (!searchInput) {
        html = '';
        html = document.createElement('li');
        html.className = 'no-albums desc';
        html.innerHTML += '<i class="material-icons icon-help">help_outline</i>Please enter an album title.</li>';
        albums.appendChild(html);
        return false;
    }


    //Main ajax callback
    function spotifySearch(data) {
      console.log(data);
      var links = document.getElementsByTagName('a');

      if (data.albums.items.length < 1) {
        html = '';
        html = document.createElement('li');
        html.className = 'no-albums desc';
        html.innerHTML += '<i class="material-icons icon-help">help_outline</i>No albums found that match: ' + searchInput + '.</li>';
        albums.appendChild(html);
      } else {
          for (var i = 0; i < data.albums.items.length; i++) {
            html = '';
            html += '<li><div class="album-wrap"><a href="#" id="' + data.albums.items[i].id + '" class="album-details">';
            html += '<img class="album-art" src="' + data.albums.items[i].images[0].url + '"></a></div>';
            html += '<span class="album-title">' + data.albums.items[i].name + '</span>';
            html += '<span class="album-artist">' + data.albums.items[i].artists[0].name + '</span></li>';
            $('#albums').append(html);
          }
        }

      //Adding event listener to call album data(tracks, ect..) once album title is clicked (exceeds expectations).
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", clickLink);
      }

    } // end spotifySearch

  $.getJSON(url, options, spotifySearch);


  //Once the album title is clicked another ajax call is made. This is the callback function (exceeds expectations).
  var clickLink = function() {
    var mainBody = document.querySelector('body');
    var mainContent = document.querySelector('div.main-content.clearfix');
    var albumEndpoint = "https://api.spotify.com/v1/albums/" + this.id;
    var albumPageDiv = document.createElement('div');
    var albumHtml = '<div id="album-details-page" class="album-page">';

    mainBody.removeChild(mainContent);

    function albumInfo(albumData) {
      console.log(albumData);

      albumHtml += '<div class="album-page-content"><span><a>Search Results</a></span>';
      albumHtml += '<span><img src="' + albumData.images[1].url + '"></span>';

      //The href in the achor tag will send the user the to albums spotify page (exceeds expectations)
      albumHtml += '<span class="separatePage"><a href="' + albumData.external_urls.spotify + '">' + albumData.name + " " + "(" + albumData.release_date.slice(0, 4) + ")" + '</a></span>';
      albumHtml += '<span class="separatePage">' + albumData.artists[0].name + '</span>';
      albumHtml += '<span class="separatePage">track list:</span>';
      albumHtml += '<ul id="trackList" class="separatePage"></ul>'
      albumHtml += '</div></div>';
      $('body').append(albumHtml);

      //"Search Results" link will call the formSubmit function all over again and reset everything and run another search.
      document.querySelector(".album-page-content span:nth-of-type(1)").addEventListener('click', function(event){
        event.preventDefault();
        formSubmit();
      });

      if (albumData.tracks.items) {
        for (var i = 0; i < albumData.tracks.items.length; i++) {
          $('#trackList').append('<li>' + albumData.tracks.items[i].track_number + ". " + albumData.tracks.items[i].name + '</li>');
        }
      }

    } // end albumInfo()

  $.getJSON(albumEndpoint, albumInfo);


  }; // end clickLink()


}; // end form submit()


})(); // end IIFE
