export default function getFormattedURL(title: string) {
  let newString = title;
  newString = newString.toLowerCase();
  newString = newString.replaceAll(/[&\/\\#,+()$~%.'":*?!@<>{}]/g, "");
  newString = newString.replaceAll(" ", "_");

  return newString;
}
