import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {publishTreatmentPageAction} from './actions/publishTreatmentPage'
import {withTreatmentPublishAction} from './actions/previousPaths'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'urology-place-web',

  basePath: '/studio',

  projectId: '5zd6me01',
  dataset: 'production',

  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (previous, context) =>
      withTreatmentPublishAction(previous, context.schemaType, publishTreatmentPageAction),
  },
})
