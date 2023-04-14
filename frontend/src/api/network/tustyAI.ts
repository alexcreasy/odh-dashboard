import axios from 'axios';
import { getRoute } from '~/api';

const NAMESPACE = 'trustyai-e2e';
const ROUTENAME = 'trustyai';

const trustyRoute = getRoute(NAMESPACE, ROUTENAME);

const trustyClient = trustyRoute.then((route) =>
  axios.create({ baseURL: `http://${route.spec.host}/` }),
);

export const registerMetricMonitoring = async (metricName: string, postBody: any) => {
  const cli = await trustyClient;

  return cli.post(`/metrics/${metricName}/request`, postBody);
};
