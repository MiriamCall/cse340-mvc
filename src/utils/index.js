import { getNavigationLinks } from "../models/index.js";

const getNav = async () => {
  console.log("getNav");
  const links = await getNavigationLinks();
  let nav = '<nav class="nav" ><ul class="nav-list">';
  links.forEach((linkInfo) => {
    nav += `<li class="nav-item"><a class="nav-link" href="${linkInfo.route}">${linkInfo.name}</a></li>`;
  });
  return `${nav}</ul></nav>`;
};

export { getNav };
