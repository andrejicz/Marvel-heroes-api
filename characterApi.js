const API_KEY = "01302fe8616347c6decaf8fc30e088f9";
const HASH = "ba81f8fdf7e1f5233e29dc5a8d5a227a";
const TS = 1;
const BASE_URL = "https://gateway.marvel.com/v1/public";

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

const characterAPI = {
  ping: () => {
    console.log("PING");
  },
  characters: async (limit, offset, name) => {
    const makeImgUrl = (thumbnail) => {
      const { path, extension } = thumbnail;
      return `${path}/portrait_uncanny.${extension}`;
    };

    try {
      const response = await fetch(
        `${BASE_URL}/characters?apikey=${API_KEY}&hash=${HASH}&ts=1&nameStartsWith=${name}&limit=${limit}&offset=${offset}`
      );
      const json = await response.json();
      const data = json.data.results;

      return data.map((d) => ({
        id: d.id,
        img: makeImgUrl(d.thumbnail),
        title: d.name,
      }));
    } catch (error) {
      console.log("Fetching error", error.message);
    }
  },
};
