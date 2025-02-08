import { getClassifications } from "../models/index.js";

const getNav = async () => {
  const classifications = await getClassifications();
  let nav = "<nav class='nav'><ul class='nav-list'>";
  classifications.forEach((row) => {
    const id = row.classification_id;
    const name = row.classification_name;
    nav += `<li class='nav-item nav-item:hover'><a href="/category/${id}" class='nav-link'>${name}</a></li>`;
  });
  return `${nav}<li class='nav-item nav-item:hover'><a href="/About" class='nav-link'>About</a></li></ul></nav>`;
};

export { getNav };
