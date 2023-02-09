const characterStore = {
  add: (character) => {
    const item = localStorage.getItem("bookmark");
    const bookmark = item !== null ? JSON.parse(item) : [];

    const index = bookmark.findIndex((item) => item.id === character.id);

    if (index !== -1) bookmark[index] = character;
    else bookmark.push(character);

    localStorage.setItem("bookmark", JSON.stringify(bookmark));
  },
  remove: (character) => {
    const item = localStorage.getItem("bookmark");
    if (item === null) return;
    const bookmark = JSON.parse(item);

    const index = bookmark.findIndex((item) => item.id === character.id);

    if (index === -1) return;
    bookmark.splice(index, 1);

    localStorage.setItem("bookmark", JSON.stringify(bookmark));
  },
  has: (id) => {
    const item = localStorage.getItem("bookmark");
    if (item === null) return false;
    const bookmark = JSON.parse(item);

    const index = bookmark.findIndex((item) => item.id === id);

    return index !== -1;
  },
  size: () => {
    const items = localStorage.getItem("bookmark");
    if(items === undefined) return 0;
    return JSON.parse(items).length
  },
  getAll: (startIndex, endIndex) => {
    const item = localStorage.getItem("bookmark");
    if (item === null) return [];

    const items = JSON.parse(item);
    if (items.length < startIndex) return [];
    const result = [];
    for (let i = startIndex; i < endIndex; i++) {
      if (items[i] !== undefined) result.push(items[i]);
    }

    return result
  },
};
