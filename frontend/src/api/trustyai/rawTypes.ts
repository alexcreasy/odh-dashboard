export enum DataTypes {
  BOOL = 'BOOL',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
  INT32 = 'INT32',
  INT64 = 'INT64',
  STRING = 'STRING',
}

export enum MetricTypes {
  SPD = 'SPD',
  DIR = 'DIR',
}

export type TypedValue<T extends TypedValueType = string> = {
  type: DataTypes;
  value: T;
};

export type TypedValueType = string | number | boolean;

export type BaseMetric = {
  protectedAttribute: string;
  outcomeName: string;
  modelId: string;
  requestName: string;
  thresholdDelta?: number;
  batchSize?: number;
};

export type BaseMetricRequest = {
  favorableOutcome: TypedValue['value'];
  privilegedAttribute: TypedValue['value'];
  unprivilegedAttribute: TypedValue['value'];
} & BaseMetric;

export type BaseMetricResponse = {
  id: string;
  request: {
    metricName: MetricTypes;
    favorableOutcome: TypedValue;
    privilegedAttribute: TypedValue;
    unprivilegedAttribute: TypedValue;
  } & BaseMetric;
};

export type BaseMetricListResponse = {
  requests: BaseMetricResponse[];
};

export type BaseMetricCreationResponse = {
  requestId: string;
  timestamp: string;
};

export type BaseMetricDeletionRequest = {
  requestId: string;
};

export type SchemaItem = {
  type: DataTypes;
  name: string;
  index: number;
  values: TypedValue['value'][];
};

export type Schema = {
  items: Record<string, SchemaItem>;
};

export type ModelMetaData = {
  metrics: {
    scheduledMetadata: {
      spd: number;
      dir: number;
    };
  };
  data: {
    inputSchema: Schema;
    outputSchema: Schema;
    observations: number;
    modelId: string;
  };
};

export type GetInfoResponse = ModelMetaData[];
