let searchForm = document.forms.search;
let btnSearch = searchForm.btnSearch;
let filmName;
let filmType;
let movieList;
let detailsList;
let section = document.querySelector("section");
let ul = document.querySelector("ul");
btnSearch.addEventListener("click", () => {
  section.innerHTML = "";
  ul.innerHTML = "";
  filmName = searchForm.title.value;
  filmType = searchForm.type.value;
  movieList = {};
  let but = document.createElement("button");
  but.innerHTML = "<<";
  but.classList.add("hide");
  ul.prepend(but);
  fetch(
    `http://www.omdbapi.com/?apikey=4ab95f5f&s=${filmName}&type=${filmType}`
  )
    .then((data) => data.json())
    .then((res) => fun(movieList, res));
});
function fun(clone, res) {
  clone = { ...res };
  console.log(clone);
  fillTable(clone);
  const maxNumberOfPage = 10;

  for (let i = 0; i < clone.totalResults / 10; i++) {
    let li = document.createElement("li");
    li.innerHTML = i + 1;
    if (i > maxNumberOfPage - 1) {
      li.classList.add("hide");
    } else {
      li.classList.add("show");
    }
    ul.append(li);
  }
  let but = document.createElement("button");
  but.innerHTML = "<";
  but.classList.add("hide");
  but.classList.add("arrow");
  ul.prepend(but);
  let but1 = document.createElement("button");
  but1.innerHTML = ">";
  but1.classList.add("arrow");
  ul.append(but1);

  let li = document.querySelectorAll("li");
  for (let i = 0; i < li.length; i++) {
    li[i].addEventListener("click", () => {
      fetch(
        `http://www.omdbapi.com/?apikey=4ab95f5f&s=${filmName}&type=${filmType}&page=${
          i + 1
        }`
      )
        .then((data) => data.json())
        .then((res) => showPage(movieList, res));
      function showPage(clone, res) {
        clone = { ...res };
        console.log(clone);
        section.innerHTML = "";
        fillTable(clone);
      }
    });
  }

  //-------------------------------------Back/Forward buttons-------------------------------------------------------
  let last;

  but1.addEventListener("click", () => {
    let find = document.querySelectorAll(".show");
    if (last === undefined) {
      last = 0;
    }
    for (let key of find) {
      last = parseInt(key.innerHTML);
      key.classList.remove("show");
      key.classList.add("hide");
    }

    for (let i = last; i < last + maxNumberOfPage; i++) {
      if (i == li.length) {
        but1.classList.remove("showBut");
        but1.classList.add("hide");
        but.classList.remove("hide");
        but.classList.add("showBut");
        break;
      } else {
        but.classList.remove("hide");
        li[i].classList.remove("hide");
        li[i].classList.add("show");
      }
    }
  });
  but.addEventListener("click", () => {
    let find = document.querySelectorAll(".show");
    let res;
    res = last;
    for (let key of find) {
      key.classList.remove("show");
      key.classList.add("hide");
    }
    for (let i = res - 1; i >= res - maxNumberOfPage; i-- && last--) {
      if (i < 10) {
        for (let a = 0; a < 10; a++) {
          li[a].classList.remove("hide");
          li[a].classList.add("show");
          last = 0;
        }
        but.classList.remove("showBut");
        but.classList.add("hide");
        but1.classList.remove("hide");
        but1.classList.add("showBut");
        break;
      } else if (i >= 0) {
        but.classList.remove("hide");
        but1.classList.remove("hide");
        li[i].classList.remove("hide");
        li[i].classList.add("show");
      }
    }
  });
}
//=========================================================Functions========================================================
function fillTable(clone) {
  for (let i = 0; i < clone.Search.length; i++) {
    let div = document.createElement("div");
    section.append(div);
    let h3 = document.createElement("h3");
    h3.innerHTML = clone.Search[i].Title;
    div.append(h3);
    p = document.createElement("p");
    p.innerHTML = clone.Search[i].Type;
    div.append(p);
    let img = document.createElement("img");
    if (clone.Search[i].Poster === "N/A") {
      img.setAttribute(
        "src",
        "https://lahousing.lacity.org/AAHR/Images/No_Image_Available.jpg"
      );
    } else {
      img.setAttribute("src", clone.Search[i].Poster);
    }
    div.append(img);
    let det = document.createElement("button");
    det.setAttribute("value", clone.Search[i].imdbID);
    det.innerHTML = "Details";
    det.classList.add("details");
    div.append(det);
  }
  //-------------------------------------------------Details  button-------------------------------------------------
  let dets = document.querySelectorAll(".details");
  for (let i = 0; i < dets.length; i++)
    dets[i].addEventListener("click", () => {
      fetch(`http://www.omdbapi.com/?apikey=4ab95f5f&i=${dets[i].value}`)
        .then((data) => data.json())
        .then((res) => showDetails(detailsList, res));
    });
}
function showDetails(clone, res) {
  clone = { ...res };
  console.log(clone);
  let container = document.createElement("article");
  container.style.display = "flex";
  container.style.flexDirection = "row";
  section.append(container);
  let detImg = document.createElement("img");
  let info = document.createElement("div");
  if (clone.Poster === "N/A") {
    detImg.setAttribute(
      "src",
      "https://lahousing.lacity.org/AAHR/Images/No_Image_Available.jpg"
    );
  } else {
    detImg.setAttribute("src", clone.Poster);
  }
  container.append(detImg);
  let detTTitle = document.createElement("h3");
  detTTitle.innerHTML = `Title:`;
  let detTReleased = document.createElement("h3");
  detTReleased.innerHTML = `Released:`;
  let detTGenre = document.createElement("h3");
  detTGenre.innerHTML = `Genre:`;
  let detTCountry = document.createElement("h3");
  detTCountry.innerHTML = `Country:`;
  let detTDirector = document.createElement("h3");
  detTDirector.innerHTML = `Director:`;
  let detTWriter = document.createElement("h3");
  detTWriter.innerHTML = `Writer:`;
  let detTActors = document.createElement("h3");
  detTActors.innerHTML = `Actors:`;
  let detTAwards = document.createElement("h3");
  detTAwards.innerHTML = `Awards:`;
  let detTitle = document.createElement("p");
  detTitle.innerHTML = clone.Title;
  let detReleased = document.createElement("p");
  detReleased.innerHTML = clone.Released;
  let detGenre = document.createElement("p");
  detGenre.innerHTML = clone.Genre;
  let detCountry = document.createElement("p");
  detCountry.innerHTML = clone.Country;
  let detDirector = document.createElement("p");
  detDirector.innerHTML = clone.Director;
  let detWriter = document.createElement("p");
  detWriter.innerHTML = clone.Writer;
  let detActors = document.createElement("p");
  detActors.innerHTML = clone.Actors;
  let detAwards = document.createElement("p");
  detAwards.innerHTML = clone.Awards;
  info.append(detTTitle);
  info.append(detTitle);
  info.append(detTReleased);
  info.append(detReleased);
  info.append(detTGenre);
  info.append(detGenre);
  info.append(detTCountry);
  info.append(detCountry);
  info.append(detTDirector);
  info.append(detDirector);
  info.append(detTWriter);
  info.append(detWriter);
  info.append(detTActors);
  info.append(detActors);
  info.append(detTAwards);
  info.append(detAwards);
  container.append(info);
  let close = document.createElement("button");
  close.innerHTML = "X";
  container.append(close);
  close.addEventListener("click", () => {
    container.remove();
  });
}
