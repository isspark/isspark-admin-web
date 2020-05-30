import defaultSettings from '@/settings'

const title = defaultSettings.title || '为你商城后台管理'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
