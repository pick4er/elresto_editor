
function parsePreciseTag(preciseTag) {
  const [commonTagName, tagSitePosition, siteTag] = preciseTag.split('_');
  return { commonTagName, tagSitePosition, siteTag };
}

export default parsePreciseTag;
