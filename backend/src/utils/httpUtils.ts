import https from 'https';
import http from 'http';
import { getDirectCallOptions } from './directCallUtils';
import { KubeFastifyInstance, OauthFastifyRequest } from '../types';
import { DEV_MODE } from './constants';

export enum ProxyErrorType {
  /** Failed during startup */
  SETUP_FAILURE,
  /** Failed at the http call level */
  HTTP_FAILURE,
  /** Failed after the connection was made but the request terminated before finishing */
  CALL_FAILURE,
}

export class ProxyError extends Error {
  public proxyErrorType: ProxyErrorType;

  constructor(type: ProxyErrorType, message: string) {
    super(message);

    this.proxyErrorType = type;
  }
}

type ProxyData = {
  method: string;
  url: string;
  requestData?: string | Buffer;
  /** Option to substitute your own content type for the API call -- defaults to JSON */
  overrideContentType?: string;
  /** Allow for unauthorized SSL connections to succeed */
  rejectUnauthorized?: boolean;
};

/** Make a very basic pass-on / proxy call to another endpoint */
export const proxyCall = (
  fastify: KubeFastifyInstance,
  request: OauthFastifyRequest,
  data: ProxyData,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { method, requestData, overrideContentType, url, rejectUnauthorized } = data;

    getDirectCallOptions(fastify, request, url)
      .then((requestOptions) => {
        if (requestData) {
          let contentType: string;
          if (overrideContentType) {
            contentType = overrideContentType;
          } else {
            contentType = `application/${
              method === 'PATCH' ? 'json-patch+json' : 'json'
            };charset=UTF-8`;
          }

          requestOptions.headers = {
            ...requestOptions.headers,
            'Content-Type': contentType,
            'Content-Length': requestData.length,
          };
        }

        if (rejectUnauthorized !== undefined) {
          requestOptions.rejectUnauthorized = rejectUnauthorized;
        }

        fastify.log.info(`Making ${method} proxy request to ${url}`);

        const web = (url: string) => {
          if (url.startsWith('http:')) {
            if (!DEV_MODE) {
              throw new ProxyError(
                ProxyErrorType.SETUP_FAILURE,
                'Insecure HTTP requests are prohibited when not in development mode.',
              );
            }
            return http;
          }
          return https;
        };

        const httpsRequest = web(url)
          .request(url, { method, ...requestOptions }, (res) => {
            let data = '';
            res
              .setEncoding('utf8')
              .on('data', (chunk) => {
                data += chunk;
              })
              .on('end', () => {
                // if (fastify.log.level === 'debug' && res.statusCode >= 400) {
                //   fastify.log.debug(
                //     `Proxied request: ${method} ${url} returned: ${res.statusCode} ${res.statusMessage}`,
                //   );
                // }
                if (res.statusCode >= 400) {
                  fastify.log.warn(
                    `Proxied request: ${method} ${url} returned: ${res.statusCode} ${res.statusMessage}`,
                  );
                }
                resolve(data);
              })
              .on('error', (error) => {
                reject(new ProxyError(ProxyErrorType.CALL_FAILURE, error.message));
              });
          })
          .on('error', (error) => {
            reject(new ProxyError(ProxyErrorType.HTTP_FAILURE, error.message));
          });

        if (requestData) {
          httpsRequest.write(requestData);
        }

        httpsRequest.end();
      })
      .catch((error) => {
        reject(new ProxyError(ProxyErrorType.SETUP_FAILURE, error.message));
      });
  });
};
