const main = $("#main");
const mainTitle = $(".character-container-title h1");
const search = $("#search");

function characterContainer() {
  return $(`<div class="character-container"></div>`);
}
function loader() {
  return $(`<div class="spinner-loader"></div>`);
}
function pageController(previousPage, nextPage) {
  if (previousPage === undefined && nextPage === undefined) return "";

  tag = $(`
    <div class="page-controller">
      <div class="previous-page">
        ${previousPage ? "<span><< Previous</span>" : ""}
      </div>
      <div class="next-page">
        ${nextPage ? "<span>Next >></span>" : ""}
      </div>
    </div>
  `);

  tag.find(".next-page span").on("click", () => {
    if (nextPage !== undefined) nextPage();
  });
  tag.find(".previous-page span").on("click", () => {
    if (previousPage !== undefined) previousPage();
  });

  return tag;
}
function characterItem(character, favorite, specialAction) {
  const { id, img, title } = character;

  const favImg = favorite ? "./favorite.svg" : "./favorite-outlined.svg";
  const favText = favorite
    ? "Remove character form bookmark"
    : "Add to character to bookmark";
  const characterTag = $(`
  <div id="${id}" class="character">
    <div class="character-img">
      <img src="${img}">
    </div>
    <div class="character-info">
      <div class="character-title">
        <span>${title}</span>
      </div>
      <div class="character-action">
        <div id="favorite-button" title="${favText}">
          <img src="${favImg}" />
        </div>
      </div>
    </div> 
  </div>
  `);

  $(characterTag)
    .find("#favorite-button")
    .on("click", function () {
      if (favorite) {
        characterStore.remove(character);
        $(this).attr("title", "Add to character to bookmark");
        $(this).find("img").attr("src", "./favorite-outlined.svg");
        favorite = false;
        if (specialAction) specialAction();
      } else {
        characterStore.add(character);
        $(this).attr("title", "Remove character form bookmark");
        $(this).find("img").attr("src", "./favorite.svg");
        favorite = true;
      }
    });

  return characterTag;
}

const searchResults = () => {
  const pageSize = 12;
  mainTitle.html("SEARCH RESULTS");
  main.html(loader());

  const renderPage = (currentPage) => {
    characterAPI
      .characters(pageSize, currentPage * pageSize, search.val())
      .then((characters) => {
        const container = characterContainer();
        characters.forEach((character, index) => {
          if(index > pageSize) return
          container.append(
            characterItem(
              {
                id: character.id,
                img: character.img,
                title: character.title,
              },
              characterStore.has(character.id)
            )
          );
        });

        if (characters.length === 0)
          main.html(
            `<h4 style="text-align: center; color: #fafafa">No results</h4>`
          );
        else {
          main.html(container);
          let nextPage = () => renderPage(currentPage + 1);
          let previousPage = () => renderPage(currentPage - 1);

          if (currentPage === 0) previousPage = undefined;
          if(characters.length < pageSize)
            nextPage = undefined
          main.append(pageController(previousPage, nextPage));
        }
      });
  };

  renderPage(0);
};

const bookmarks = () => {
  const pageSize = 20;

  mainTitle.html("BOOKMARKED CHARACTERS");
  main.html("");

  const renderPage = (currentPage) => {
    const startIndex = currentPage * pageSize;
    const endIndex = (currentPage + 1) * pageSize;

    const characters = characterStore.getAll(startIndex, endIndex);
    const container = characterContainer();

    for (let i = 0; i < characters.length; i++) {
      if (i >= pageSize) break;
      container.append(
        characterItem(characters[i], true, () => {
          renderPage(currentPage);
        })
      );
    }
    if (characters.length === 0)
      main.html(
        `<h4 style="text-align: center; color: #fafafa">No bookmarks</h4>`
      );
    else {
      main.html(container);

      let nextPage = undefined;
      if (characterStore.size() > endIndex)
        nextPage = () => renderPage(currentPage + 1);

      let previousPage = undefined;
      if (startIndex > 0) previousPage = () => renderPage(currentPage - 1);

      main.append(pageController(previousPage, nextPage));
    }
  };

  renderPage(0);
};

$(document).ready(() => {
  bookmarks();
  let timer = undefined;
  search.on("input", function () {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      const input = $(this).val();
      if (input.length === 0) bookmarks();
      else searchResults();
    }, 500);
  });
});
