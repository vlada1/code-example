// GeneralViews
import MainLayout from '@/layouts/MainLayout/MainLayout';
import BlocksExplorerLayout from '@/layouts/BlocksExplorerLayout/BlocksExplorerLayout';
import ErrorPage from '@/pages/ErrorPage';
import Login from '@/pages/LoginPage';
import AccountCreationPage from '@/pages/AccountCreationPage';
import RestorePasswordPage from '@/pages/RestorePasswordPage';
import PasswordResetPage from '@/pages/PasswordResetPage';
import ShipmentPublicPage from '@/pages/ShipmentPublicPage';
import StandardPublicPage from '@/pages/StandardPublicPage';
import BlocksTransactionsPage from '@/pages/BlocksTransactionsPage';
import BlocksPage from '@/pages/BlocksPage';
import TransactionsPage from '@/pages/TransactionsPage';
import BlockDetailPage from '@/pages/BlockDetailPage';
import TransactionDetailPage from '@/pages/TransactionDetailPage';

const StandardsList = () => import('@/components/Certificates/Standards/StandardsList');
const StandardsPage = () => import('@/pages/StandardsPage.vue');
const StandardDetailPage = () => import('@/pages/StandardDetailPage');
const ShipmentsList = () => import('@/components/Certificates/Shipments/ShipmentsList');
const ShipmentsPage = () => import('@/pages/ShipmentsPage');
const ShipmentDetailPage = () => import('@/pages/ShipmentDetailPage');
const ShipmentCreate = () => import('@/components/Certificates/Shipments/ShipmentCreate');
const StandardCreate = () => import('@/components/Certificates/Standards/StandardCreate');
const CertificateHistoryLinearPage = () => import('@/pages/CertificateHistoryLinearPage');
const ProfilePage = () => import('@/pages/ProfilePage.vue');
const NotificationsPage = () => import('@/pages/NotificationsPage');
const AccessControlPage = () => import('@/pages/AccessControlPage');
const CustomersSuppliersPage = () => import('@/pages/CustomersSuppliersPage');
const CustomerSupplierDetailPage = () => import('@/pages/CustomerSupplierDetailPage');
const TemplatesList = () => import('@/components/Templates/TemplatesList');
const TemplatesPage = () => import('@/pages/TemplatesPage');
const TemplatesDetailPage = () => import('@/pages/TemplatesDetailPage');
const TemplateManage = () => import('@/components/Templates/TemplateManage');

import { store } from '@/store';

import { CLASSES } from '@/shared/messages';

const checkAuthentication = async (to, from, next) => {
  if (to.name === 'ShipmentDetailPage' || to.name === 'StandardDetailPage') {
    await checkCertificatePage(to, from, next);
    return;
  }
  let redirect;
  to.path.length > 1 ? redirect = to.path : '';
  try {
    if (await store.dispatch('CHECK_USER_ACCESS_TOKEN')) {
      next();
      return;
    } else if (await store.dispatch('CHECK_USER_REFRESH_TOKEN')) {
      await store.dispatch('REFRESH_TOKEN');
      next();
      return;
    }
  } catch (e) {
    next({ path: '/login', query: { redirect } });
  }

  next({ path: '/login', query: { redirect } });
};

const checkCertificatePage = async (to, from, next) => {
  try {
    if (await store.dispatch('CHECK_USER_ACCESS_TOKEN')) {
      next();
      return;
    } else if (await store.dispatch('CHECK_USER_REFRESH_TOKEN')) {
      await store.dispatch('REFRESH_TOKEN');
      next();
      return;
    }
  } catch (e) {
    checkPublicPage(to, from, next);
  }

  checkPublicPage(to, from, next);
};

const checkPublicPage = (to, from, next) => {
  if (to.name === 'StandardDetailPage') {
    next({
      name: 'Standard Public',
      params: { id: to.params.id },
      query: {
        redirect: to.path
      }
    });
  }
  if (to.name === 'ShipmentDetailPage') {
    next({
      name: 'Shipment Public',
      params: { id: to.params.id },
      query: {
        redirect: to.path
      }
    });
  }
};

let authPages = [
  {
    path: '/login',
    component: Login,
    name: 'Login'
  },
  {
    path: '/new-account/:entityId/:hash?',
    component: AccountCreationPage,
    name: 'Create Account'
  },
  {
    path: '/restore-password',
    component: RestorePasswordPage,
    name: 'Restore Password'
  },
  {
    path: '/password-validation/:hash',
    component: PasswordResetPage,
    name: 'Validate Password'
  },
  {
    path: '/password-reset/:hash',
    component: PasswordResetPage,
    name: 'Reset Password'
  },
  {
    path: '/account-validation/:hash',
    component: PasswordResetPage,
    name: 'Validate Account'
  }
];

let standards = {
  path: '/standards',
  name: 'Standards',
  component: StandardsPage,
  redirect: '/standards',
  meta: {
    breadcrumb: 'router.standardsList.breadcrumb'
  },
  children: [
    {
      path: '',
      component: StandardsList,
      meta: {
        mainTitle: 'router.standardsList.title',
        description: 'router.standardsList.description',
        containerClasses: CLASSES.standardsList
      }
    },
    {
      path: 'create',
      name: 'Create Standard',
      component: StandardCreate,
      meta: {
        mainTitle: 'router.standardCreate.title',
        description: 'router.standardCreate.description',
        containerClasses: CLASSES.standardCreate,
        breadcrumb: 'router.standardCreate.breadcrumb'
      },
    },
    {
      path: ':id',
      name: 'StandardDetailPage',
      component: StandardDetailPage,
      beforeEnter: (to, from, next) => {
        to.meta.mainTitle = to.query.code;
        to.meta.breadcrumb = to.query.code;
        next();
      },
      meta: {
        description: 'router.details.description',
        containerClasses: CLASSES.details
      },
      children: [
        {
          path: 'history',
          name: 'History Standard',
          component: CertificateHistoryLinearPage,
          beforeEnter: (to, from, next) => {
            to.matched[to.matched.length - 2].meta.breadcrumb = to.query.code;
            to.meta.mainTitle = 'router.history.title';
            to.meta.breadcrumb = 'router.history.breadcrumb';
            next();
          },
          meta: {
            description: 'router.history.description',
            containerClasses: CLASSES.history,
            breadcrumb: 'router.history.breadcrumb'
          },
        },
      ],
    },
  ]
};

let shipments = {
  path: '/shipments',
  name: 'Shipments',
  component: ShipmentsPage,
  redirect: '/shipments/',
  meta: {
    breadcrumb: 'router.shipmentsList.breadcrumb'
  },
  children: [
    {
      path: '',
      component: ShipmentsList,
      meta: {
        mainTitle: 'router.shipmentsList.title',
        description: 'router.shipmentsList.description',
        containerClasses: CLASSES.shipmentsList,
      }
    },
    {
      path: 'create',
      name: 'Create Shipment',
      component: ShipmentCreate,
      meta: {
        mainTitle: 'router.shipmentCreate.title',
        description: 'router.shipmentCreate.description',
        containerClasses: CLASSES.shipmentCreate,
        breadcrumb: 'router.shipmentCreate.breadcrumb'
      }
    },
    {
      path: ':id',
      name: 'ShipmentDetailPage',
      component: ShipmentDetailPage,
      beforeEnter: (to, from, next) => {
        to.meta.mainTitle = to.query.code;
        to.meta.breadcrumb = to.query.code;
        next();
      },
      meta: {
        description: 'router.details.description',
        containerClasses: CLASSES.details
      },
      children: [
        {
          path: 'history',
          name: 'History Shipment',
          component: CertificateHistoryLinearPage,
          beforeEnter: (to, from, next) => {
            to.matched[to.matched.length - 2].meta.breadcrumb = to.query.code;
            to.meta.mainTitle = 'router.history.title';
            to.meta.breadcrumb = 'router.history.breadcrumb';
            next();
          },
          meta: {
            description: 'router.history.description',
            containerClasses: CLASSES.history,
            breadcrumb: 'router.history.breadcrumb'
          },
        },
      ],
    },
  ]
};

let publicPages = [
  {
    path: '/shipment/public/:id',
    component: ShipmentPublicPage,
    name: 'Shipment Public'
  },
  {
    path: '/standard/public/:id',
    component: StandardPublicPage,
    name: 'Standard Public'
  }
];

// let settings = {
//   path: '/settings',
//   component: DashboardLayout,
//   name: 'settings',
//   redirect: '/settings/creation',
//   beforeEnter: checkAuthentication,
//   children: [
//     {
//       path: 'creation',
//       name: 'settings.creation',
//       component: CertificatesSettings,
//       props: () => ({
//         type: 'creation',
//       })
//     },
//     {
//       path: 'transfer',
//       name: 'settings.transfer',
//       component: CertificatesSettings,
//       props: () => ({
//         type: 'sale',
//       })
//     },
//   ]
// };

// let entities = {
//   path: '/entities',
//   component: DashboardLayout,
//   name: 'entities',
//   redirect: '/entities/list',
//   beforeEnter: checkAuthentication,
//   children: [
//     {
//       path: 'list',
//       name: 'entities.list',
//       components: {
//         default: ListEntity
//       }
//     },
//     {
//       path: 'create',
//       name: 'entities.create',
//       components: {
//         default: CreateEntity
//       }
//     },
//   ]
// };

let profile = {
  path: '/profile',
  name: 'Profile',
  component: ProfilePage,
  meta: {
    mainTitle: 'router.profile.title',
    description: 'router.profile.description',
    containerClasses: CLASSES.profile,
    breadcrumb: 'router.profile.breadcrumb'
  }
};

let notifications = {
  path: '/notifications',
  name: 'Notifications',
  component: NotificationsPage,
  meta: {
    mainTitle: 'router.notifications.title',
    description: 'router.notifications.description',
    containerClasses: CLASSES.notifications,
    breadcrumb: 'router.notifications.breadcrumb',
    titleSuffix: () => store.getters.getNotificationsCount
  }
};

let accessControl = {
  path: '/access-control',
  name: 'Access Control',
  component: AccessControlPage,
  meta: {
    mainTitle: 'router.accessControl.title',
    description: 'router.accessControl.description',
    containerClasses: CLASSES.accessControl,
    breadcrumb: 'router.accessControl.breadcrumb'
  }
};

let customersSuppliers = {
  path: '/customers-suppliers',
  name: 'Customers/Suppliers',
  component: CustomersSuppliersPage,
  meta: {
    mainTitle: 'router.customersSuppliers.title',
    description: 'router.customersSuppliers.description',
    containerClasses: CLASSES.customersSuppliers,
    breadcrumb: 'router.customersSuppliers.breadcrumb'
  },
  children: [
    {
      path: ':name',
      name: 'CustomerSupplierDetailPage',
      component: CustomerSupplierDetailPage,
      beforeEnter: (to, from, next) => {
        to.meta.mainTitle = to.params.name;
        to.meta.breadcrumb = to.params.name;
        next();
      },
      meta: {
        description: 'router.customersSuppliersDetails.description',
        containerClasses: CLASSES.customersSuppliersDetails
      },
    },
  ],
};

let templates = {
  path: '/templates',
  name: 'Standards templates',
  component: TemplatesPage,
  redirect: '/templates',
  meta: {
    breadcrumb: 'router.templatesList.breadcrumb'
  },
  children: [
    {
      path: '',
      component: TemplatesList,
      meta: {
        mainTitle: 'router.templatesList.title',
        description: 'router.templatesList.description',
        containerClasses: CLASSES.templatesList
      }
    },
    {
      path: 'manage/:id?',
      name: 'Manage Standard Template',
      component: TemplateManage,
      beforeEnter: (to, from, next) => {
        if (to.params.id) {
          to.meta.breadcrumb = to.query.name;
        }
        next();
      },
      meta: {
        mainTitle: 'router.templateManage.title',
        description: 'router.templateManage.description',
        containerClasses: CLASSES.templateManage,
        breadcrumb: 'router.templateManage.breadcrumb'
      },
    },
    {
      path: ':id',
      name: 'TemplateDetailPage',
      component: TemplatesDetailPage,
      beforeEnter: (to, from, next) => {
        to.meta.mainTitle = to.query.name;
        to.meta.breadcrumb = to.query.name;
        next();
      },
      meta: {
        description: 'router.templateDetails.description',
        containerClasses: CLASSES.templateDetails
      },
    },
  ],
};

let blockExplorer = [
  {
    path: '/blocks-explorer',
    component: BlocksExplorerLayout,
    meta: {
      breadcrumb: 'router.blocksTransactions.breadcrumb'
    },
    children: [
      {
        path: '',
        name: 'Blocks explorer',
        component: BlocksTransactionsPage,
        meta: {
          mainTitle: 'router.blocksTransactions.title',
          description: 'router.blocksTransactions.description',
          containerClasses: CLASSES.blocksTransactions,
        },
      },
      {
        path: '/blocks',
        name: 'Blocks',
        component: BlocksPage,
        meta: {
          mainTitle: 'router.blocks.title',
          description: 'router.blocks.description',
          containerClasses: CLASSES.blocks,
          breadcrumb: 'router.blocks.breadcrumb'
        },
        children: [
          {
            path: ':hash',
            name: 'Block detailed info',
            component: BlockDetailPage,
            meta: {
              mainTitle: 'router.blockItem.title',
              description: 'router.blockItem.description',
              containerClasses: CLASSES.blockItem,
              breadcrumb: 'router.blockItem.breadcrumb'
            },
          },
        ],
      },
      {
        path: '/transactions',
        name: 'Transactions',
        component: TransactionsPage,
        meta: {
          mainTitle: 'router.transactions.title',
          description: 'router.transactions.description',
          containerClasses: CLASSES.transactions,
          breadcrumb: 'router.transactions.breadcrumb'
        },
        children: [
          {
            path: ':hash',
            name: 'Transaction detailed info',
            component: TransactionDetailPage,
            meta: {
              mainTitle: 'router.transactionItem.title',
              description: 'router.transactionItem.description',
              containerClasses: CLASSES.blockItem,
              breadcrumb: 'router.transactionItem.breadcrumb'
            },
          },
        ],
      }
    ],
  },
];

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainLayout,
    beforeEnter: checkAuthentication,
    redirect: '/shipments',
    children: [
      standards,
      shipments,
      // entities,
      // settings,
      profile,
      notifications,
      accessControl,
      customersSuppliers,
      templates,
    ]
  },
  ...authPages,
  ...publicPages,
  ...blockExplorer,
  {
    path: '*',
    component: ErrorPage,
    props: () => ({
      errorCode: 404,
      title: 'router.notFoundPage.title',
      message: 'router.notFoundPage.message'
    })
  }
];

export default routes;
