var carIcon = L.icon({
  iconUrl: "./icons/car.png",
  iconSize: [50, 60],
});
var homeIcon = L.icon({
  iconUrl: "./icons/home-marker.png",
  iconSize: [50, 60],
});
var jobIcon = L.icon({
  iconUrl: "./icons/job.png",
  iconSize: [50, 60],
});
var visitIcon = L.icon({
  iconUrl: "./icons/visit.png",
  iconSize: [50, 60],
});

export const detecIcon = (type) => {
  switch (type) {
    case "park":
      return carIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    case "goto":
      return visitIcon;
  }
};

//* Gönderilen veriye göre local storage günceller.
export const setStorage = (data) => {
  //* veriyi locale göndermek için stringe çevirdik.
  const strData = JSON.stringify(data);
  //* local Storage güncelledik
  localStorage.setItem("notes", strData);
};
