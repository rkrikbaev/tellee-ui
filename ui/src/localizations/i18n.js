import i18n from 'i18next'
import {reactI18nextModule} from 'react-i18next'

i18n.use(reactI18nextModule).init({
  // we init with resources
  resources: {
    en: {
      translations: {
        Dashboards: 'Dashboards',
        'Create Dashboard': 'Create Dashboard',
        version: 'Version',
        'Template Variables': 'Template Variables',
        'Add Cell': 'Add Cell',
        'Filter by Name...': 'Filter by Name...',
        AutoRefresh: 'AutoRefresh',
        Paused: 'Paused',
        'Every 5s': 'Every 5s',
        'Every 10s': 'Every 10s',
        'Every 15s': 'Every 15s',
        'Every 30s': 'Every 30s',
        'Every 60s': 'Every 60s',
        'Data Explorer': 'Data Explorer',
        'Time Machine': 'Time Machine',
        'Host List': 'Host List',
        'InfluxDB Admin': 'InfluxDB Admin',
        Admin: 'Admin',
        Configuration: 'Configuration',
        'Orgs and Users': 'Orgs and Users',
        'Manage Tasks': 'Manage Tasks',
        'Alert History': 'Alert History',
        'Switch Organizations': 'Switch Organizations',
        Account: 'Account',
        'Log out': 'Log out',
      },
    },
    ru: {
      translations: {
        Dashboards: 'Панель управления',
        'Create Dashboard': 'Новая панель',
        version: 'Версия ПО',
        'Template Variables': 'Настройки',
        'Add Cell': 'Новый график',
        'Filter by Name...': 'Фильтровать по названию...',
        AutoRefresh: 'АвтоОбновление',
        Paused: 'Пауза',
        'Every 5s': 'Обнов 5с',
        'Every 10s': 'Обнов 10с',
        'Every 15s': 'Обнов 15с',
        'Every 30s': 'Обнов 30с',
        'Every 60s': 'Обнов 60с',
        'Data Explorer': 'Просмотр базы',
        'Time Machine': 'Машина времени',
        'Host List': 'Список хостов',
        'InfluxDB Admin': 'Админ InfluxDB ',
        Admin: 'Админ',
        Configuration: 'Конфигурация',
        'Orgs and Users': 'Пользователи',
        'Manage Tasks': 'Задания',
        'Alert History': 'Оповещения',
        'Switch Organizations': 'Сменить пользователя',
        Account: 'Учетная запись',
        'Log out': 'Выход',
      },
    },
  },
  fallbackLng: 'en',
  debug: true,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },

  react: {
    wait: true,
  },
})

export default i18n
