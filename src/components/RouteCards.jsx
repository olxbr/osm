import { observer } from 'mobx-react-lite';
import { Link as RouterLink } from 'react-router-dom';
import { Heading, Flex, Link } from '@adobe/react-spectrum';
import { routes } from '../routes';
import '@spectrum-css/card';

const renderRouteCards = (items) => {
  return items.map((route) => {
    if (route.name === 'Home' || route.isHidden) {
      return '';
    }

    if (route.isHeader) {
      return (
        <div key={route.name} style={{ marginBottom: '50px' }}>
          <Heading level={3}>{route.name}</Heading>
          <Flex wrap="wrap" gap="size-300">
            {route.items?.length > 0 && renderRouteCards(route.items)}
          </Flex>
        </div>
      );
    }

    return (
      <div
        key={route.name}
        className="spectrum-Card spectrum-Card--sizeM"
        tabIndex="0"
        style={{ width: '280px' }}>
        <div className="spectrum-Card-body">
          <div className="spectrum-Card-header">
            <div className="spectrum-Card-title spectrum-Heading spectrum-Heading--sizeXS">
              {route.name}
            </div>
          </div>
          <div className="spectrum-Card-content">
            <div className="spectrum-Card-subtitle spectrum-Detail spectrum-Detail--sizeS">
              {route.description}
            </div>
          </div>
        </div>
        <div className="spectrum-Card-footer">
          <Link>
            <RouterLink to={route.path}>Go to {route.name}</RouterLink>
          </Link>
        </div>
      </div>
    );
  });
};

const getRouteItems = (routes, routeName) => {
  for (let route of routes) {
    if (route.name === routeName) {
      return route.items ?? [];
    }

    if (route.items) {
      return getRouteItems(route.items, routeName);
    }
  }

  return [];
};

export const RouteCards = observer(({ routeName }) => {
  let items = routes;

  if (routeName) {
    items = getRouteItems(routes, routeName);
    return (
      <Flex wrap="wrap" gap="size-300">
        {renderRouteCards(items)}
      </Flex>
    );
  }

  return renderRouteCards(items);
});
