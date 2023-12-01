import * as React from 'react';
import ManageInferenceServiceModal from '~/pages/modelServing/screens/projects/InferenceServiceModal/ManageInferenceServiceModal';
import { Table } from '~/components/table';
import { InferenceServiceKind, ProjectKind, ServingRuntimeKind } from '~/k8sTypes';
import { ProjectsContext } from '~/concepts/projects/ProjectsContext';
import DashboardEmptyTableView from '~/concepts/dashboard/DashboardEmptyTableView';
import InferenceServiceTableRow from './InferenceServiceTableRow';
import { getGlobalInferenceServiceColumns, getProjectInferenceServiceColumns } from './data';
import DeleteInferenceServiceModal from './DeleteInferenceServiceModal';

type InferenceServiceTableProps = {
  clearFilters?: () => void;
  inferenceServices: InferenceServiceKind[];
  servingRuntimes: ServingRuntimeKind[];
  refresh: () => void;
  currentProject: ProjectKind;
} & Partial<Pick<React.ComponentProps<typeof Table>, 'enablePagination' | 'toolbarContent'>>;

const InferenceServiceTable: React.FC<InferenceServiceTableProps> = ({
  clearFilters,
  inferenceServices,
  servingRuntimes,
  refresh,
  enablePagination,
  toolbarContent,
  currentProject,
}) => {
  const { modelServingProjects: projects } = React.useContext(ProjectsContext);
  const [deleteInferenceService, setDeleteInferenceService] =
    React.useState<InferenceServiceKind>();
  const [editInferenceService, setEditInferenceService] = React.useState<InferenceServiceKind>();
  const isGlobal = !!clearFilters;
  const mappedColumns = isGlobal
    ? getGlobalInferenceServiceColumns(projects)
    : getProjectInferenceServiceColumns();
  return (
    <>
      <Table
        data={inferenceServices}
        columns={mappedColumns}
        variant={isGlobal ? undefined : 'compact'}
        toolbarContent={toolbarContent}
        enablePagination={enablePagination}
        emptyTableView={
          isGlobal ? <DashboardEmptyTableView onClearFilters={clearFilters} /> : undefined
        }
        rowRenderer={(is) => (
          <InferenceServiceTableRow
            key={is.metadata.uid}
            obj={is}
            servingRuntime={servingRuntimes.find(
              (sr) => sr.metadata.name === is.spec.predictor.model.runtime,
            )}
            isGlobal={isGlobal}
            onDeleteInferenceService={setDeleteInferenceService}
            onEditInferenceService={setEditInferenceService}
            currentProject={currentProject}
          />
        )}
      />
      <DeleteInferenceServiceModal
        inferenceService={deleteInferenceService}
        onClose={(deleted) => {
          if (deleted) {
            refresh();
          }
          setDeleteInferenceService(undefined);
        }}
      />
      <ManageInferenceServiceModal
        isOpen={editInferenceService !== undefined}
        editInfo={editInferenceService}
        onClose={(edited) => {
          if (edited) {
            refresh();
          }
          setEditInferenceService(undefined);
        }}
      />
    </>
  );
};

export default InferenceServiceTable;
