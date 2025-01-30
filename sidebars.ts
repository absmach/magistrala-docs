import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  userSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Overview',
    },
    {
      type: 'doc',
      id: 'architecture',
      label: 'Architecture',
    },
    {
      type: 'doc',
      id: 'users-quick-start',
      label: 'Getting Started',
    },
    {
      type: 'category',
      label: 'Domain Management',
      items: [
        {type: 'doc', id: 'domains', label: 'Domains'},
        {type: 'doc', id: 'billing', label: 'Billing'},
        {type: 'doc', id: 'invitations', label: 'Invitations'},
      ],
    },
    {
      type: 'doc',
      id: 'users',
      label: 'Profile Management',
    },
    {
      type: 'category',
      label: 'Client Management',
      items: [
        {type: 'doc', id: 'groups', label: 'Groups'},
        {type: 'doc', id: 'clients', label: 'Clients'},
        {type: 'doc', id: 'channels', label: 'Channels'},
      ],
    },
    {
      type: 'doc',
      id: 'dashboards',
      label: 'Dashboards',
    },
    {
      type: 'doc',
      id: 'widgets',
      label: 'Widgets',
    },
    {
      type: 'doc',
      id: 'bootstraps',
      label: 'Bootstraps',
    },
  ],
  devSidebar: [
    {
      type: 'category',
      label: 'Concepts',
      items: [
        {type: 'doc', id: 'entities', label: 'Entities'},
        {type: 'doc', id: 'authentication', label: 'Authentication'},
        {type: 'doc', id: 'authorization', label: 'Authorization'},
        {type: 'doc', id: 'security', label: 'Security'},
        {type: 'doc', id: 'messaging', label: 'Messaging'},
      ],
    },
    {
      type: 'category',
      label: 'Quick Start',
      items: [
        {type: 'doc', id: 'getting-started', label: 'Getting Started'},
        {type: 'doc', id: 'api', label: 'API'},
        {type: 'doc', id: 'cli', label: 'CLI'},
      ],
    },
    {
      type: 'category',
      label: 'Development Tools',
      items: [
        {type: 'doc', id: 'dev-guide', label: 'Developers Guide'},
        {type: 'doc', id: 'events', label: 'Events'},
        {type: 'doc', id: 'tracing', label: 'Tracing'},
      ],
    },
    {
      type: 'doc',
      id: 'storage',
      label: 'Storage',
    },
    {
      type: 'doc',
      id: 'edge',
      label: 'Edge',
    },
    {
      type: 'doc',
      id: 'certs',
      label: 'Certs',
    },
    {
      type: 'doc',
      id: 'kubernetes',
      label: 'Kubernetes',
    },
    {
      type: 'category',
      label: 'Extensions',
      items: [
        {type: 'doc', id: 'lora', label: 'LoRa'},
        {type: 'doc', id: 'opcua', label: 'OPC-UA'},
        {type: 'doc', id: 'provision', label: 'Provisioning'},
        {type: 'doc', id: 'twins', label: 'Twins Service'},
        {type: 'doc', id: 'bootstrap', label: 'Bootstrap'},
      ],
    },
    {
      type: 'doc',
      id: 'benchmark',
      label: 'Test Spec',
    },
  ],

};

export default sidebars;
