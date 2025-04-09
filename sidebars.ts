import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  userSidebar: [
    {
      type: "doc",
      id: "user-guide/index",
      label: "Overview",
    },
    {
      type: "doc",
      id: "user-guide/architecture",
      label: "Architecture",
    },
    {
      type: "doc",
      id: "user-guide/users-quick-start",
      label: "Getting Started",
    },
    {
      type: 'category',
      label: 'Domain Management',
      link: {
        type: "doc",
        id: "user-guide/domain-management/introduction",
      },
      collapsible: true,
      items: [
        { type: "doc", id: "user-guide/domain-management/domain", label: "Domain" },
        { type: "doc", id: "user-guide/domain-management/billing", label: "Billing" },
        { type: "doc", id: "user-guide/domain-management/invitations", label: "Invitations" },
      ],
    },
    {
      type: "category",
      label: "Client Management",
      collapsible: true,
      link: {
        type: "doc",
        id: "user-guide/clients/introduction",
      },
      items: [
        { type: "doc", id: "user-guide/clients/groups", label: "Groups" },
        { type: "doc", id: "user-guide/clients/clients", label: "Clients" },
        { type: "doc", id: "user-guide/clients/channels", label: "Channels" },
        { type: "doc", id: "user-guide/clients/bootstraps", label: "Bootstraps" },
      ],
    },
    {
      type: "category",
      label: "Dashboards",
      link: {
        type: "doc",
        id: "user-guide/dashboards/introduction",
      },
      collapsible: true,
      items: [
        { type: "doc", id: "user-guide/dashboards/dashboards", label: "Dashboard" },
        { type: "doc", id: "user-guide/dashboards/widgets", label: "Widgets" },
        { type: "doc", id: "user-guide/dashboards/linechart", label: "Line Chart" },
        { type: "doc", id: "user-guide/dashboards/areachart", label: "Area Chart" },
        { type: "doc", id: "user-guide/dashboards/barchart", label: "Bar Chart" },
        { type: "doc", id: "user-guide/dashboards/gauges", label: "Gauges" },
        { type: "doc", id: "user-guide/dashboards/piechart", label: "Pie Chart" },
        { type: "doc", id: "user-guide/dashboards/countcard", label: "Count Card" },
        { type: "doc", id: "user-guide/dashboards/tablecard", label: "Table Card" },
        { type: "doc", id: "user-guide/dashboards/valuecard", label: "Value Card" },
        { type: "doc", id: "user-guide/dashboards/maps", label: "Maps" },
        { type: "doc", id: "user-guide/dashboards/controls", label: "Controls" },
      ],
    },
    {
      type: "doc",
      id: "user-guide/rules-engine",
      label: "Rules Engine",
    },
    {
      type: "doc",
      id: "user-guide/profile-management/users",
      label: "Profile Management",
    },
     {
      type: "doc",
      id: "user-guide/pats",
      label: "Personal Access Tokens",
    },
  ],
  devSidebar: [
    { type: 'doc', id: 'dev-guide/getting-started', label: 'Developer Guide' },
    { type: 'doc', id: 'dev-guide/entities', label: 'Entities' },
    {
      type: "category",
      label: "CLI",
      link: {
        type: "doc",
        id: "dev-guide/cli/introduction-to-cli",
      },
      collapsible: true,
      items: [
        { type: "doc", id: "dev-guide/cli/users-cli", label: "Users Management" },
        { type: "doc", id: "dev-guide/cli/groups-cli", label: "Groups Management" },
        { type: "doc", id: "dev-guide/cli/domains-cli", label: "Domains Management" },
        { type: "doc", id: "dev-guide/cli/clients-cli", label: "Clients Management" },
        { type: "doc", id: "dev-guide/cli/channels-cli", label: "Channels Management" },
        { type: "doc", id: "dev-guide/cli/bootstrap-cli", label: "Bootstrap Management" },
        { type: "doc", id: "dev-guide/cli/consumers-cli", label: "Consumers Management" },
        { type: "doc", id: "dev-guide/cli/provision-cli", label: "Provisioning Management" },
      ],
    },
    {
      type: "category",
      label: "Services",
      link: {
        type: "doc",
        id: "dev-guide/introduction",
      },
      collapsible: true,
      items: [
        { type: "doc", id: "dev-guide/bootstrap", label: "Bootstrap" },
        { type: "doc", id: "dev-guide/consumers", label: "Consumers" },
        { type: "doc", id: "dev-guide/provision", label: "Provisioning" },
        { type: "doc", id: "dev-guide/readers", label: "Readers" },
        { type: "doc", id: "dev-guide/rules-engine", label: "Rules Engine" },
      ],
    },
    { type: 'doc', id: 'dev-guide/api', label: 'API' },
    { type: 'doc', id: 'dev-guide/roles-schema', label: 'Roles' },
    {
      type: "category",
      label: "Development Tools",
      link: {
        type: "doc",
        id: "dev-guide/tools-introduction",
      },
      items: [
        { type: 'doc', id: 'dev-guide/authentication', label: 'Authentication' },
        { type: 'doc', id: 'dev-guide/authorization', label: 'Authorization' },
        { type: 'doc', id: 'dev-guide/messaging', label: 'Messaging' },
        { type: 'doc', id: 'dev-guide/security', label: 'Security' },
        { type: "doc", id: "dev-guide/events", label: "Events" },
        { type: "doc", id: "dev-guide/tracing", label: "Tracing" },
        { type: "doc", id: "dev-guide/storage", label: "Storage" },
      ],
    },
    {
      type: "doc",
      id: "dev-guide/edge",
      label: "Edge",
    },
    {
      type: "doc",
      id: "dev-guide/certs",
      label: "Certs",
    },
    {
      type: "doc",
      id: "dev-guide/kubernetes",
      label: "Kubernetes",
    },
    {
      type: "category",
      label: "Extensions",
      items: [
        { type: "doc", id: "dev-guide/lora", label: "LoRa" },
        { type: "doc", id: "dev-guide/opcua", label: "OPC-UA" },
      ],
    },
    {
      type: "doc",
      id: "dev-guide/benchmark",
      label: "Test Spec",
    },
  ],
};

export default sidebars;
