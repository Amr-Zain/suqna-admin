export type Tags = 'notifications' |
  'cities' | 'regions' | 'countries' | 'packages' |
  'page' | 'social-media' | 'settings' | 'contact-us' | 'sliders' | 'ads' | 'subscriptions'
  | 'about' | 'principles' | 'team' | 'journey' | 'ad-comments' | 'ad-rates' | 'departments' | 'qualifications' | 'bannars' | 'contacts' | 'terms' | 'faqs' | 'providers' | 'clients' | 'roles' | 'admins' | 'permissions'

export const getQueryKeys = {
  all: (tag: Tags) => [tag] as const,
  getFiltered: (tag: Tags, params: Record<string, unknown>) => [tag, 'filtered', params] as const,
  getOne: (tag: Tags, id: string) => [tag, 'one', id] as const,
}
