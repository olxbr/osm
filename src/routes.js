import { S3Home, S3FindBucket, S3ListBuckets } from './pages/S3';
import { IAMHome } from './pages/IAM';
import { Home } from './pages';
import { S3Bucket } from './pages/S3/S3Bucket';

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
        items: []
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
            description: 'List all buckets in an Account',
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
