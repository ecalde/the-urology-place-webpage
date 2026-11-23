import authorType from './authorType'
import homeAnnouncementType from './homeAnnouncementType'
import postType from './postType'
import privacyPolicyType from './privacyPolicyType'
import teamCategoryType from './teamCategoryType'
import teamMemberType from './teamMemberType'
import treatmentPageSchemaTypes from './treatmentPage'

export const schemaTypes = [
  authorType,
  homeAnnouncementType,
  postType,
  privacyPolicyType,
  teamCategoryType,
  teamMemberType,
  ...treatmentPageSchemaTypes,
]
