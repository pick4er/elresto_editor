
function parsePreciseTag(preciseTag) {
  const tagParts = preciseTag.split('_');

  const commonTagName = tagParts[0];
  const tagSitePosition = tagParts[1];
  const siteTag = tagParts[2];

  return { commonTagName, tagSitePosition, siteTag };
}

export default parsePreciseTag;