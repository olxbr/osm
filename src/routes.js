import { Home } from './pages';
import { S3Home, S3FindBucket, S3ListBuckets, S3Bucket } from './pages/S3';
import { IAMHome, IAMListRoles, IAMRole } from './pages/IAM';
import { EC2Home, EC2FindByIP } from './pages/EC2';

export const routes = [
  {
    name: 'Home',
    path: '/',
    Component: Home,
  },
  {
    name: 'Tools',
    description: 'A set of tools categorized by AWS resource type',
    isHeader: true,
    items: [
      {
        name: 'IAM',
        description: 'Tools to analyze IAM Roles and Policies',
        path: '/tools/iam',
        Component: IAMHome,
        items: [
          {
            name: 'List Roles',
            description: 'List roles to review excessive permissions',
            path: '/tools/iam/roles',
            Component: IAMListRoles,
          },
          {
            name: 'Role',
            isHidden: true,
            path: '/tools/iam/roles/:roleName',
            Component: IAMRole,
          },
        ],
      },
      {
        name: 'EC2',
        description: 'EC2 Tools',
        path: '/tools/ec2',
        Component: EC2Home,
        items: [
          {
            name: 'Find by IP',
            description: "Find EC2/ELB by it's IP address",
            path: '/tools/ec2/find-by-ip',
            Component: EC2FindByIP,
          },
        ],
      },
      {
        name: 'S3',
        description: 'Inspect, validate and execute actions on S3 Buckets',
        path: '/tools/s3',
        Component: S3Home,
        items: [
          {
            name: 'Find Bucket',
            description: 'Find a bucket in one or more AWS Accounts',
            path: '/tools/s3/find-bucket',
            Component: S3FindBucket,
          },
          {
            name: 'List Buckets',
            description: 'List buckets in an Account for review',
            path: '/tools/s3/buckets',
            Component: S3ListBuckets,
          },
          {
            name: 'Bucket',
            isHidden: true,
            path: '/tools/s3/buckets/:bucketName',
            Component: S3Bucket,
          },
        ],
      },
    ],
  },
  {
    name: 'Services',
    description: 'Security related services',
    isHeader: true,
    items: [
      {
        name: 'SIEM',
        description: 'Security Information and Event Management',
        path: '/services/siem',
        Component: () => <div>SIEM</div>,
        items: [],
      },
      {
        name: 'Security Hub',
        description: 'AWS Security Hub findings',
        path: '/services/security-hub',
        Component: () => <div>Security Hub</div>,
        items: [],
      },
    ],
  },
];

const flatRoutes = (routes, final = []) => {
  for (const route of routes) {
    final.push(route);
    route.items?.length && flatRoutes(route.items, final);
  }

  return final;
};

export const flattenedRoutes = flatRoutes(routes);
