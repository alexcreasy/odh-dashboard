/* eslint-disable camelcase */
import {
  mockDashboardConfig,
  mockK8sResourceList,
  mockComponents,
  mockRegisteredModel,
  mockModelVersion,
  mockModelVersionList,
  mockModelArtifactList,
  mockModelRegistryService,
  mockServingRuntimeK8sResource,
  mockInferenceServiceK8sResource,
  mockProjectK8sResource,
  mockDscStatus,
} from '~/__mocks__';
import { mockModelArtifact } from '~/__mocks__/mockModelArtifact';

import {
  InferenceServiceModel,
  ProjectModel,
  ServiceModel,
  ServingRuntimeModel,
} from '~/__tests__/cypress/cypress/utils/models';
import { verifyRelativeURL } from '~/__tests__/cypress/cypress/utils/url';
import { modelVersionDetails } from '~/__tests__/cypress/cypress/pages/modelRegistry/modelVersionDetails';
import { InferenceServiceModelState } from '~/pages/modelServing/screens/types';
import { modelServingGlobal } from '~/__tests__/cypress/cypress/pages/modelServing';
import {
  ModelRegistryMetadataType,
  ModelState,
  ModelSourceKind,
} from '~/concepts/modelRegistry/types';
import { KnownLabels } from '~/k8sTypes';
import { asProjectEditUser } from '~/__tests__/cypress/cypress/utils/mockUsers';

const MODEL_REGISTRY_API_VERSION = 'v1alpha3';
const mockModelVersions = mockModelVersion({
  id: '1',
  name: 'Version 1',
  customProperties: {
    a1: {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: 'v1',
    },
    a2: {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: 'v2',
    },
    a3: {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: 'v3',
    },
    a4: {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: 'v4',
    },
    a5: {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: 'v5',
    },
    a6: {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: 'v1',
    },
    a7: {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: 'v7',
    },
    'Testing label': {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: '',
    },
    'Financial data': {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: '',
    },
    'Fraud detection': {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: '',
    },
    'Long label data to be truncated abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc':
      {
        metadataType: ModelRegistryMetadataType.STRING,
        string_value: '',
      },
    'Machine learning': {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: '',
    },
    'Next data to be overflow': {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: '',
    },
    'Label x': {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: '',
    },
    'Label y': {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: '',
    },
    'Label z': {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: '',
    },
    _registeredFromPipelineProject: {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: 'test-project',
    },
    _registeredFromPipelineRunId: {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: 'pipelinerun1',
    },
    _registeredFromPipelineRunName: {
      metadataType: ModelRegistryMetadataType.STRING,
      string_value: 'pipeline-run-test',
    },
  },
});

const mockModelArtifactWithSource = mockModelArtifact({
  modelSourceKind: ModelSourceKind.KFP,
  modelSourceGroup: 'test-project',
  modelSourceId: 'pipelinerun1',
  modelSourceName: 'pipeline-run-test',
});

const mockModelArtifactFromCatalog = mockModelArtifact({
  modelSourceKind: ModelSourceKind.CATALOG,
  modelSourceClass: 'test-catalog-source',
  modelSourceGroup: 'test-catalog-repo',
  modelSourceName: 'test-catalog-model',
  modelSourceId: 'test-catalog-tag',
});

const initIntercepts = (
  isEmptyProject = false,
  fromCatalog = false,
  modelCatalogAvailable = true,
) => {
  cy.interceptOdh(
    'GET /api/config',
    mockDashboardConfig({
      disableModelRegistry: false,
      disableFineTuning: false,
      disableModelCatalog: !modelCatalogAvailable,
    }),
  );

  cy.interceptOdh(
    'GET /api/dsc/status',
    mockDscStatus({
      installedComponents: {
        'model-registry-operator': true,
      },
    }),
  );

  cy.interceptOdh('GET /api/components', { query: { installed: 'true' } }, mockComponents());

  cy.interceptK8sList(
    ServiceModel,
    mockK8sResourceList([
      mockModelRegistryService({ name: 'modelregistry-sample' }),
      mockModelRegistryService({ name: 'modelregistry-sample-2' }),
    ]),
  );

  cy.interceptK8sList(
    ProjectModel,
    mockK8sResourceList(!isEmptyProject ? [mockProjectK8sResource({})] : []),
  );

  cy.interceptOdh(
    `GET /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/registered_models/:registeredModelId`,
    {
      path: {
        serviceName: 'modelregistry-sample',
        apiVersion: MODEL_REGISTRY_API_VERSION,
        registeredModelId: 1,
      },
    },

    mockRegisteredModel({}),
  );

  cy.interceptOdh(
    `PATCH /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/model_versions/:modelVersionId`,
    {
      path: {
        serviceName: 'modelregistry-sample',
        apiVersion: MODEL_REGISTRY_API_VERSION,
        modelVersionId: 1,
      },
    },
    mockModelVersions,
  ).as('UpdatePropertyRow');

  cy.interceptOdh(
    `GET /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/registered_models/:registeredModelId/versions`,
    {
      path: {
        serviceName: 'modelregistry-sample',
        apiVersion: MODEL_REGISTRY_API_VERSION,
        registeredModelId: 1,
      },
    },
    mockModelVersionList({
      items: [
        mockModelVersion({
          name: 'Version 1',
          author: 'Author 1',
          registeredModelId: '1',
        }),
        mockModelVersion({
          author: 'Author 2',
          registeredModelId: '1',
          id: '2',
          name: 'Version 2',
        }),
        mockModelVersion({
          author: 'Author 3',
          registeredModelId: '1',
          id: '3',
          name: 'Version 3',
          state: ModelState.ARCHIVED,
        }),
      ],
    }),
  );

  cy.interceptOdh(
    `GET /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/model_versions/:modelVersionId`,
    {
      path: {
        serviceName: 'modelregistry-sample',
        apiVersion: MODEL_REGISTRY_API_VERSION,
        modelVersionId: 1,
      },
    },
    mockModelVersions,
  );

  cy.interceptOdh(
    `GET /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/model_versions/:modelVersionId`,
    {
      path: {
        serviceName: 'modelregistry-sample',
        apiVersion: MODEL_REGISTRY_API_VERSION,
        modelVersionId: 2,
      },
    },
    mockModelVersion({ id: '2', name: 'Version 2' }),
  );

  cy.interceptOdh(
    `GET /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/model_versions/:modelVersionId/artifacts`,
    {
      path: {
        serviceName: 'modelregistry-sample',
        apiVersion: MODEL_REGISTRY_API_VERSION,
        modelVersionId: 1,
      },
    },
    mockModelArtifactList({
      items: [fromCatalog ? mockModelArtifactFromCatalog : mockModelArtifactWithSource],
    }),
  );
};

describe('Model version details', () => {
  describe('Details tab', () => {
    beforeEach(() => {
      initIntercepts(false, false);
      modelVersionDetails.visit();
    });

    it('Model version details registered from catalog', () => {
      initIntercepts(false, true, true);
      modelVersionDetails.visit();
      modelVersionDetails.findVersionId().contains('1');
      modelVersionDetails.findRegisteredFromCatalog().should('exist');
      modelVersionDetails
        .findRegisteredFromCatalog()
        .should('have.text', 'test-catalog-model (test-catalog-tag)');
      modelVersionDetails.findRegisteredFromCatalog().click();
      verifyRelativeURL(
        '/modelCatalog/test-catalog-source/test-catalog-repo/test-catalog-model/test-catalog-tag',
      );
    });

    it('Model version details registered from catalog with model catalog unavailable', () => {
      initIntercepts(false, true, false);
      modelVersionDetails.visit();
      modelVersionDetails.findVersionId().contains('1');
      modelVersionDetails.findRegisteredFromCatalog().should('exist');
      modelVersionDetails.findRegisteredFromTitle().should('exist');
    });

    it('Model version details page header', () => {
      verifyRelativeURL(
        '/modelRegistry/modelregistry-sample/registeredModels/1/versions/1/details',
      );
      cy.findByTestId('app-page-title').should('have.text', 'Version 1');
      cy.findByTestId('breadcrumb-version-name').should('have.text', 'Version 1');
    });

    it('Model version details tab registered from pipeline', () => {
      modelVersionDetails.findVersionId().contains('1');
      modelVersionDetails.findRegisteredFromPipeline().should('exist');
      modelVersionDetails
        .findRegisteredFromPipeline()
        .should('have.text', 'Run pipeline-run-test inTest Project');
      modelVersionDetails.findDescription().should('have.text', 'Description of model version');
      modelVersionDetails.findPipelineRunLink().should('have.text', 'Run pipeline-run-test in');
      modelVersionDetails.findPipelineRunLink().click();
      verifyRelativeURL('/pipelineRuns/test-project/runs/pipelinerun1');
    });

    it('should add a property', () => {
      modelVersionDetails.findAddPropertyButton().click();
      modelVersionDetails.findAddKeyInput().type('new_key');
      modelVersionDetails.findAddValueInput().type('new_value');
      modelVersionDetails.findCancelButton().click();

      modelVersionDetails.findAddPropertyButton().click();
      modelVersionDetails.findAddKeyInput().type('new_key');
      modelVersionDetails.findAddValueInput().type('new_value');
      modelVersionDetails.findSaveButton().click();
      cy.wait('@UpdatePropertyRow');
    });

    it('should edit a property row', () => {
      modelVersionDetails.findExpandControlButton().should('have.text', 'Show 2 more properties');
      modelVersionDetails.findExpandControlButton().click();
      const propertyRow = modelVersionDetails.getRow('a6');
      propertyRow.find().findKebabAction('Edit').click();
      modelVersionDetails.findKeyEditInput('a6').clear().type('edit_key');
      modelVersionDetails.findValueEditInput('v1').clear().type('edit_value');

      modelVersionDetails.findCancelButton().click();
      propertyRow.find().findKebabAction('Edit').click();
      modelVersionDetails.findKeyEditInput('a6').clear().type('edit_key');
      modelVersionDetails.findValueEditInput('v1').clear().type('edit_value');
      modelVersionDetails.findSaveButton().click();
      cy.wait('@UpdatePropertyRow').then((interception) => {
        expect(interception.request.body).to.eql({
          customProperties: {
            a1: { metadataType: 'MetadataStringValue', string_value: 'v1' },
            a2: { metadataType: 'MetadataStringValue', string_value: 'v2' },
            a3: { metadataType: 'MetadataStringValue', string_value: 'v3' },
            a4: { metadataType: 'MetadataStringValue', string_value: 'v4' },
            a5: { metadataType: 'MetadataStringValue', string_value: 'v5' },
            a7: { metadataType: 'MetadataStringValue', string_value: 'v7' },
            'Testing label': { metadataType: 'MetadataStringValue', string_value: '' },
            'Financial data': { metadataType: 'MetadataStringValue', string_value: '' },
            'Fraud detection': { metadataType: 'MetadataStringValue', string_value: '' },
            'Long label data to be truncated abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc':
              { metadataType: 'MetadataStringValue', string_value: '' },
            'Machine learning': { metadataType: 'MetadataStringValue', string_value: '' },
            'Next data to be overflow': { metadataType: 'MetadataStringValue', string_value: '' },
            'Label x': { metadataType: 'MetadataStringValue', string_value: '' },
            'Label y': { metadataType: 'MetadataStringValue', string_value: '' },
            'Label z': { metadataType: 'MetadataStringValue', string_value: '' },
            _registeredFromPipelineProject: {
              metadataType: 'MetadataStringValue',
              string_value: 'test-project',
            },
            _registeredFromPipelineRunId: {
              metadataType: 'MetadataStringValue',
              string_value: 'pipelinerun1',
            },
            _registeredFromPipelineRunName: {
              metadataType: 'MetadataStringValue',
              string_value: 'pipeline-run-test',
            },
            edit_key: { string_value: 'edit_value', metadataType: 'MetadataStringValue' },
          },
        });
      });
    });

    it('should delete a property row', () => {
      modelVersionDetails.findExpandControlButton().should('have.text', 'Show 2 more properties');
      modelVersionDetails.findExpandControlButton().click();
      const propertyRow = modelVersionDetails.getRow('a6');
      modelVersionDetails.findPropertiesTableRows().should('have.length', 7);
      propertyRow.find().findKebabAction('Delete').click();
      cy.wait('@UpdatePropertyRow').then((interception) => {
        expect(interception.request.body).to.eql({
          customProperties: {
            a1: { metadataType: 'MetadataStringValue', string_value: 'v1' },
            a2: { metadataType: 'MetadataStringValue', string_value: 'v2' },
            a3: { metadataType: 'MetadataStringValue', string_value: 'v3' },
            a4: { metadataType: 'MetadataStringValue', string_value: 'v4' },
            a5: { metadataType: 'MetadataStringValue', string_value: 'v5' },
            a7: { metadataType: 'MetadataStringValue', string_value: 'v7' },
            'Testing label': { metadataType: 'MetadataStringValue', string_value: '' },
            'Financial data': { metadataType: 'MetadataStringValue', string_value: '' },
            'Fraud detection': { metadataType: 'MetadataStringValue', string_value: '' },
            'Long label data to be truncated abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc':
              { metadataType: 'MetadataStringValue', string_value: '' },
            'Machine learning': { metadataType: 'MetadataStringValue', string_value: '' },
            'Next data to be overflow': { metadataType: 'MetadataStringValue', string_value: '' },
            'Label x': { metadataType: 'MetadataStringValue', string_value: '' },
            'Label y': { metadataType: 'MetadataStringValue', string_value: '' },
            'Label z': { metadataType: 'MetadataStringValue', string_value: '' },
            _registeredFromPipelineProject: {
              metadataType: 'MetadataStringValue',
              string_value: 'test-project',
            },
            _registeredFromPipelineRunId: {
              metadataType: 'MetadataStringValue',
              string_value: 'pipelinerun1',
            },
            _registeredFromPipelineRunName: {
              metadataType: 'MetadataStringValue',
              string_value: 'pipeline-run-test',
            },
          },
        });
      });
    });

    it('Switching model versions', () => {
      cy.interceptOdh(
        `GET /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/model_versions/:modelVersionId/artifacts`,
        {
          path: {
            serviceName: 'modelregistry-sample',
            apiVersion: MODEL_REGISTRY_API_VERSION,
            modelVersionId: 2,
          },
        },
        mockModelArtifactList({}),
      );
      modelVersionDetails.findVersionId().contains('1');
      modelVersionDetails.findModelVersionDropdownButton().click();
      modelVersionDetails.findModelVersionDropdownItem('Version 3').should('not.exist');
      modelVersionDetails.findModelVersionDropdownSearch().fill('Version 2');
      modelVersionDetails.findModelVersionDropdownItem('Version 2').click();
      modelVersionDetails.findVersionId().contains('2');
    });

    it('should handle label editing', () => {
      modelVersionDetails.findEditLabelsButton().click();

      modelVersionDetails.findAddLabelButton().click();
      cy.findByTestId('editable-label-group')
        .should('exist')
        .within(() => {
          cy.contains('New Label').should('exist').click();
          cy.focused().type('First Label{enter}');
        });

      modelVersionDetails.findAddLabelButton().click();
      cy.findByTestId('editable-label-group')
        .should('exist')
        .within(() => {
          cy.contains('New Label').should('exist').click();
          cy.focused().type('Second Label{enter}');
        });

      cy.findByTestId('editable-label-group').within(() => {
        cy.contains('First Label').should('exist').click();
        cy.focused().type('Updated First Label{enter}');
      });

      cy.findByTestId('editable-label-group').within(() => {
        cy.contains('Second Label').parent().find('[data-testid^="remove-label-"]').click();
      });

      modelVersionDetails.findSaveLabelsButton().should('exist').click();
    });

    it('should validate label length', () => {
      modelVersionDetails.findEditLabelsButton().click();

      const longLabel = 'a'.repeat(64);
      modelVersionDetails.findAddLabelButton().click();
      cy.findByTestId('editable-label-group')
        .should('exist')
        .within(() => {
          cy.contains('New Label').should('exist').click();
          cy.focused().type(`${longLabel}{enter}`);
        });

      cy.findByTestId('label-error-alert')
        .should('be.visible')
        .within(() => {
          cy.contains(`can't exceed 63 characters`).should('exist');
        });
    });

    it('should validate duplicate labels', () => {
      modelVersionDetails.findEditLabelsButton().click();

      modelVersionDetails.findAddLabelButton().click();
      cy.findByTestId('editable-label-group')
        .should('exist')
        .within(() => {
          cy.get('[data-testid^="editable-label-"]').last().click();
          cy.focused().type('{selectall}{backspace}Testing label{enter}');
        });

      modelVersionDetails.findAddLabelButton().click();
      cy.findByTestId('editable-label-group')
        .should('exist')
        .within(() => {
          cy.get('[data-testid^="editable-label-"]').last().click();
          cy.focused().type('{selectall}{backspace}Testing label{enter}');
        });

      cy.findByTestId('label-error-alert')
        .should('be.visible')
        .within(() => {
          cy.contains('Testing label already exists').should('exist');
        });
    });

    it('Pipeline run link unavailable for users without project access.', () => {
      asProjectEditUser();
      initIntercepts(true);
      modelVersionDetails.visit();
      modelVersionDetails.shouldNotHavePipelineRunLink();
      modelVersionDetails.findPipelineRunLink().should('contain.text', 'pipeline-run-test');
      modelVersionDetails.findProjectAccessInfoButton().click();
      modelVersionDetails.shouldHaveProjectAccessInfo();
    });
  });

  describe('Registered deployments tab', () => {
    beforeEach(() => {
      initIntercepts();
    });

    it('renders empty state when the version has no registered deployments', () => {
      cy.interceptK8sList(InferenceServiceModel, mockK8sResourceList([]));
      cy.interceptK8sList(ServingRuntimeModel, mockK8sResourceList([]));

      modelVersionDetails.visit();
      modelVersionDetails.findRegisteredDeploymentsTab().click();

      cy.findByTestId('model-version-deployments-empty-state').should('exist');
    });

    it('renders table with data', () => {
      cy.interceptK8sList(
        InferenceServiceModel,
        mockK8sResourceList([
          mockInferenceServiceK8sResource({
            url: 'test-inference-status.url.com',
            activeModelState: InferenceServiceModelState.LOADED,
            additionalLabels: {
              [KnownLabels.REGISTERED_MODEL_ID]: '1',
              [KnownLabels.MODEL_VERSION_ID]: '1',
            },
          }),
          mockInferenceServiceK8sResource({
            url: 'test-inference-status.url.com',
            displayName: 'Test Inference Service-2',
            name: 'Test Inference Service-2',
            activeModelState: InferenceServiceModelState.LOADED,
            additionalLabels: {
              [KnownLabels.REGISTERED_MODEL_ID]: '1',
              [KnownLabels.MODEL_VERSION_ID]: '1',
              [KnownLabels.MODEL_REGISTRY_NAME]: 'modelregistry-sample',
            },
          }),
          mockInferenceServiceK8sResource({
            url: 'test-inference-status.url.com',
            displayName: 'Test Inference Service-3',
            name: 'Test Inference Service-3',
            activeModelState: InferenceServiceModelState.LOADED,
            additionalLabels: {
              [KnownLabels.REGISTERED_MODEL_ID]: '1',
              [KnownLabels.MODEL_VERSION_ID]: '1',
              [KnownLabels.MODEL_REGISTRY_NAME]: 'modelregistry-sample-1',
            },
          }),
        ]),
      );
      cy.interceptK8sList(
        ServingRuntimeModel,
        mockK8sResourceList([mockServingRuntimeK8sResource({})]),
      );

      modelVersionDetails.visit();
      modelVersionDetails.findRegisteredDeploymentsTab().click();

      modelServingGlobal.getModelRow('Test Inference Service').should('exist');
      modelServingGlobal.getModelRow('Test Inference Service-2').should('exist');
      modelServingGlobal.findRows().should('have.length', 2);
    });
  });

  describe('Model Version Details', () => {
    beforeEach(() => {
      initIntercepts();
      // Mock fine-tuning as enabled
      cy.interceptOdh(
        'GET /api/dsc/status',
        mockDscStatus({
          installedComponents: {
            'model-registry-operator': true,
            'data-science-pipelines-operator': true,
          },
        }),
      );
      modelVersionDetails.visit();
    });

    it('should update source model format', () => {
      cy.interceptOdh(
        'PATCH /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/model_artifacts/:artifactId',
        {
          path: {
            serviceName: 'modelregistry-sample',
            apiVersion: MODEL_REGISTRY_API_VERSION,
            artifactId: '1',
          },
        },
        mockModelArtifact({}),
      ).as('updateModelFormat');

      cy.interceptOdh(
        'PATCH /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/registered_models/:registeredModelId',
        {
          path: {
            serviceName: 'modelregistry-sample',
            apiVersion: MODEL_REGISTRY_API_VERSION,
            registeredModelId: '1',
          },
        },
        mockRegisteredModel({}),
      );

      modelVersionDetails.findSourceModelFormat('edit').click();
      modelVersionDetails
        .findSourceModelFormat('group')
        .find('input')
        .clear()
        .type('UpdatedFormat');
      modelVersionDetails.findSourceModelFormat('save').click();

      cy.wait('@updateModelFormat').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          modelFormatName: 'UpdatedFormat',
        });
      });
    });

    it('should update source model version', () => {
      cy.interceptOdh(
        'PATCH /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/model_artifacts/:artifactId',
        {
          path: {
            serviceName: 'modelregistry-sample',
            apiVersion: MODEL_REGISTRY_API_VERSION,
            artifactId: '1',
          },
        },
        mockModelArtifact({}),
      ).as('updateModelVersion');

      cy.interceptOdh(
        'PATCH /api/service/modelregistry/:serviceName/api/model_registry/:apiVersion/registered_models/:registeredModelId',
        {
          path: {
            serviceName: 'modelregistry-sample',
            apiVersion: MODEL_REGISTRY_API_VERSION,
            registeredModelId: '1',
          },
        },
        mockRegisteredModel({}),
      );

      modelVersionDetails.findSourceModelVersion('edit').click();
      modelVersionDetails.findSourceModelVersion('group').find('input').clear().type('2.0.0');
      modelVersionDetails.findSourceModelVersion('save').click();

      cy.wait('@updateModelVersion').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          modelFormatVersion: '2.0.0',
        });
      });
    });

    it('should handle lab tune workflow', () => {
      // Mock project with pipeline access
      cy.interceptK8sList(
        ProjectModel,
        mockK8sResourceList([
          mockProjectK8sResource({
            k8sName: 'data-science-project',
            displayName: 'Data Science Project',
            isDSProject: true,
          }),
        ]),
      );
      modelVersionDetails.findLabTuneButton().click();
      modelVersionDetails.findStartRunModal().should('exist');
    });
  });

  describe('model serving is disabled', () => {
    beforeEach(() => {
      initIntercepts();
      // Mock fine-tuning as enabled
      cy.interceptOdh(
        'GET /api/dsc/status',
        mockDscStatus({
          installedComponents: {
            'model-registry-operator': true,
            'data-science-pipelines-operator': true,
          },
        }),
      );
      modelVersionDetails.visit();
    });

    it('should show the deploy button as disabled', () => {
      cy.interceptOdh(
        'GET /api/config',
        mockDashboardConfig({
          disableModelServing: true,
        }),
      );
      modelVersionDetails.findDeployModelButton().click();
      cy.findByRole('tooltip').should(
        'contain.text',
        'To enable model serving, an administrator must first select a model serving platform in the cluster settings.',
      );
    });
  });
});
