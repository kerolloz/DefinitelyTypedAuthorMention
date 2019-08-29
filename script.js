async function getPageText(url) {
  return await (await fetch(url)).text();
}

async function getAuthors() {
  const packageName = $("#package-name").val();
  const definitionsIndexURL = `https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/${packageName}/index.d.ts`;
  const definitionsCode = await getPageText(definitionsIndexURL);
  const regex = /github.com\/(.*)>$/gm;
  let authors = [];
  let author = regex.exec(definitionsCode);
  while (author != null) {
    authors.push(author[1]);
    author = regex.exec(definitionsCode);
  }
  return authors;
}

function renderAuthor(username) {
  console.log("user ->", username);
  return `<div class="item">
    <img
      class="ui avatar image"
      src="https://avatars.githubusercontent.com/${username}"
    />
    <div class="content">
      <div class="header">
      <a href='//github.com/${username}'>@${username} </a>
      </div>
    </div>
  </div>`;
}

$(".ui.form").submit(async function(e) {
  e.preventDefault();
  $(".ui.statistic .value").text(0);
  $("#list-of-authors").html("");
  $(".ui.form").addClass("loading");
  const authors = await getAuthors();
  if (authors.length)
    $("#list-of-authors").html(authors.map(username => renderAuthor(username)));
  $(".ui.statistic .value").text(authors.length);
  $(".ui.form").removeClass("loading");
});

$("#copy").click(function() {
  const authorsMentions = $("#list-of-authors .content .header a").text();
  navigator.clipboard
    .writeText(authorsMentions)
    .then(() => {
      $("#copy")
        .popup({
          title: "Successfully copied to clipboard!",
          on: "manual",
          exclusive: true,
          position: "bottom center"
        })
        .popup("show");
    })
    .catch(err => {
      $("#copy")
        .popup({
          title: "Error!",
          content: err,
          on: "manual",
          exclusive: true,
          position: "bottom center"
        })
        .popup("show");
      console.error(err);
    });
});
