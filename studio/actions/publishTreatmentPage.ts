import {useDocumentOperation} from 'sanity'
import type {DocumentActionComponent} from 'sanity'

import {previousPathsForPublish} from './previousPaths'

/**
 * Wraps the default Publish action. When the section, parent, or slug changes,
 * the previously published address is appended to previousPaths before publish.
 */
export function publishTreatmentPageAction(
  original: DocumentActionComponent,
): DocumentActionComponent {
  const Action: DocumentActionComponent = (props) => {
    const originalResult = original(props)
    const {patch} = useDocumentOperation(props.id, props.type)
    if (!originalResult) return null
    return {
      ...originalResult,
      onHandle: () => {
        if (!originalResult.disabled) {
          const next = previousPathsForPublish(props.draft, props.published)
          if (next) {
            patch.execute([{set: {previousPaths: next}}])
          }
        }
        originalResult.onHandle?.()
      },
    }
  }
  Action.action = 'publish'
  return Action
}
