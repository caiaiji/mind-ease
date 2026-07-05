import { useEffect } from 'react'

const SITE_NAME = '心晴驿站 - 给心灵放个假'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  }, [title])
}
