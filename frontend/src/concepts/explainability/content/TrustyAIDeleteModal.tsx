import React from 'react';
import DeleteModal from '~/pages/projects/components/DeleteModal';
import { K8sStatus } from '~/k8sTypes';

type TrustyAIDeleteModalProps = {
  isOpen: boolean;
  onDelete: () => Promise<K8sStatus>;
  onClose: (deleted: boolean) => void;
};

const TrustyAIDeleteModal: React.FC<TrustyAIDeleteModalProps> = ({ isOpen, onDelete, onClose }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<Error>();

  return (
    <DeleteModal
      title="Uninstall TrustyAI Service"
      isOpen={isOpen}
      onClose={() => {
        setIsDeleting(false);
        setError(undefined);
        onClose(false);
      }}
      deleting={isDeleting}
      onDelete={() => {
        setIsDeleting(true);
        onDelete()
          .then(() => onClose(true))
          .catch((e) => setError(e))
          .finally(() => setIsDeleting(false));
      }}
      error={error}
      deleteName="trustyai"
      submitButtonLabel="Uninstall"
    >
      This will uninstall the TrustyAI service from this project and all associated data, such as
      model bias configurations.
    </DeleteModal>
  );
};

export default TrustyAIDeleteModal;
