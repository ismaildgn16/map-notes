import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { detecIcon } from "./helpers.js";
import { setStorage } from "./helpers.js";

var map;
let coords = [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
var layerGroup = [];

//* Haritaya tıkladığımızda çalışır ve paremetresine tıkladığımız yerle alakalı veriler gelir.
const onMapClick = (e) => {
  //* Haritaya tıkladığımızda form alanının style özelliğini flex yap
  form.style.display = "flex";
  //* Coords dizisine tıkladığımız yerin koordinatlarını ekle
  coords = [e.latlng.lat, e.latlng.lng];
};

//* kullanıcının konumuna göre ekrana haritayı göster
const loadMap = (e) => {
  //* Haritanın kurulumu
  map = L.map("map").setView([51.505, -0.09], 13);

  //* Haritanın nasıl gözükeceğini belirler
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  //* Haritada ekrana basılacak olan imleçleri tutacağımız katmandır.
  layerGroup = L.layerGroup().addTo(map);

  //* localden gelen notes ları listeler
  renderNoteList(notes);

  //* Haritada bir tıklanma olduğunda çalışacak olan fonksiyondur ve fonksiyon event'ına tıkladığımız konumla ilgili veriler gidecektir.
  map.on("click", onMapClick);
};

navigator.geolocation.getCurrentPosition(
  loadMap,
  console.log("Kullanıcı kabul etmedi")
);

const renderMaker = (item) => {
  L.marker(item.coords, { icon: detecIcon(item.status) })
    .addTo(layerGroup)
    .bindPopup(`${item.desc}`);
};

const renderNoteList = (item) => {
  list.innerHTML = "";

  //* markerları temizler.
  layerGroup.clearLayers();

  item.forEach((item) => {
    const listElement = document.createElement("li");

    //* data'sına sahip olduğu id'yi  ekleme
    listElement.dataset.id = item.id;

    listElement.innerHTML = `
        <div>
            <p>${item.desc}</p>
            <p><span>Tarih:</span>09.09.2024</p>
            <p><span>Durum:</span>status</p>
        </div>
        <i id="delete" class="bi bi-x"></i>
        <i id="fly" class="bi bi-airplane-fill"></i>
    `;

    //* List etiketinin içerisine listElement'i eklerken öncesine eklemek istediğimiz için insertAdjacentElement' kullandık.
    list.insertAdjacentElement("afterbegin", listElement);

    renderMaker(item);
  });
};

const handleSubmit = (e) => {
  e.preventDefault();

  //* input'ların ve select'in içerisindeki değerleri al
  const desc = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  //* Notes dizisine oluşturduğumuz yeni not objesini ekledik.
  notes.push({ id: uuidv4(), desc, date, status, coords });

  //* LocalStorage güncelleme
  setStorage(notes);

  renderNoteList(notes);

  form.style.display = "none";
};

const handleClick = (e) => {
  //* güncellenecek olan elemanın id'sini öğrenme
  const id = e.target.parentElement.dataset.id;
  if (e.target.id === "delete") {
    //* id'sini bildiğimiz elemanı diziden kaldırma
    notes = notes.filter((note) => note.id != id);

    //* locali günceller
    setStorage(notes);

    //* ekranı günceller
    renderNoteList(notes);
  }

  if (e.target.id === "fly") {
    //* tıkladığımız elemanı dizi içerisinde bulduk.
    const note = notes.find((note) => note.id == id);

    //* harita üzerinde bulduğumuz kısma yönlendirme yaptık.
    map.flyTo(note.coords);
  }
};

//! Html'den gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");

//! Olay izleyicileri
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);
