import { Grid2, Pagination } from '@sistent/sistent';
import React, { useState } from 'react';
import MesheryPatternCard from './MesheryPatternCard';
import DesignConfigurator from '../configuratorComponents/MeshModel';
import { FILE_OPS } from '../../utils/Enum';
import { EVENT_TYPES } from '../../lib/event-types';
import {
  GridNoContainerStyles,
  GridNoPapperStyles,
  GridNoTextStyles,
  GridPaginationStyles,
} from './Grid.styles';
import { RJSFModalWrapper } from '../General/Modals/Modal';
import ExportModal from '../ExportModal';
import downloadContent from '@/utils/fileDownloader';
import { useNotification } from '@/utils/hooks/useNotification';
import { Modal as SistentModal } from '@sistent/sistent';
import type {
  MesheryPatternData,
  MesheryPatternFile,
  MesheryPatternGridSelectedState,
  MesheryPatternGridSubmitPayload,
  MesheryPatternPublishModalState,
  MesheryRJSFSchema,
} from '../types/design';

import Pattern from '../../public/static/img/drawer-icons/pattern_svg';
const INITIAL_GRID_SIZE = { xl: 6, md: 6, xs: 12 };

const TypedDesignConfigurator = DesignConfigurator as React.ComponentType<{
  pattern: MesheryPatternData | null;
  show: (_value: MesheryPatternGridSelectedState) => void;
  onSubmit: (_payload: MesheryPatternGridSubmitPayload) => void;
}>;

type MesheryPatternGridProps = {
  patterns?: MesheryPatternData[];
  handlePublish: (_data: Record<string, unknown>) => void;
  handleUnpublishModal: (_event: React.MouseEvent, _pattern: MesheryPatternData) => () => Promise<void>;
  handleClone: (_patternId: string, _patternName: string) => void;
  handleSubmit: (_payload: MesheryPatternGridSubmitPayload) => void;
  setSelectedPattern: (_value: MesheryPatternGridSelectedState) => void;
  selectedPattern: MesheryPatternGridSelectedState;
  pages?: number;
  setPage: (_page: number) => void;
  selectedPage: number;
  canPublishPattern?: boolean;
  publishModal: MesheryPatternPublishModalState;
  setPublishModal: (_publishModal: MesheryPatternPublishModalState) => void;
  publishSchema: {
    rjsfSchema: MesheryRJSFSchema;
    uiSchema: MesheryRJSFSchema;
  };
  user?: {
    user_id?: string;
  };
  handleInfoModal: (_pattern: MesheryPatternData) => void;
  openDeployModal: (
    _event: React.MouseEvent,
    _patternFile: MesheryPatternFile,
    _name: string,
    _patternId: string,
  ) => void;
  openValidationModal: (
    _event: React.MouseEvent,
    _patternFile: MesheryPatternFile,
    _name: string,
    _patternId: string,
  ) => void;
  openUndeployModal: (
    _event: React.MouseEvent,
    _patternFile: MesheryPatternFile,
    _name: string,
    _patternId: string,
  ) => void;
  openDryRunModal: (
    _event: React.MouseEvent,
    _patternFile: MesheryPatternFile,
    _name: string,
    _patternId: string,
  ) => void;
  hideVisibility?: boolean;
  arePatternsReadOnly?: boolean;
  'data-testid'?: string;
};

type PatternCardGridItemProps = {
  pattern: MesheryPatternData;
  handleDeploy: (_event: React.MouseEvent) => void;
  handleVerify: (_event: React.MouseEvent) => void;
  handleDryRun: (_event: React.MouseEvent) => void;
  handlePublishModal: () => void;
  handleUnpublishModal: (_event: React.MouseEvent) => Promise<void>;
  handleUnDeploy: (_event: React.MouseEvent) => void;
  handleClone: (_patternId: string, _patternName: string) => void;
  handleSubmit: (_payload: MesheryPatternGridSubmitPayload) => void;
  handleDownload: (_event: React.MouseEvent) => void;
  setSelectedPatterns: (_value: MesheryPatternGridSelectedState) => void;
  user?: {
    user_id?: string;
  };
  handleInfoModal: () => void;
  hideVisibility?: boolean;
  isReadOnly?: boolean;
};

function PatternCardGridItem({
  pattern,
  handleDeploy,
  handleVerify,
  handleDryRun,
  handlePublishModal,
  handleUnpublishModal,
  handleUnDeploy,
  handleClone,
  handleSubmit,
  handleDownload,
  setSelectedPatterns,
  user,
  handleInfoModal,
  hideVisibility = false,
  isReadOnly = false,
}: PatternCardGridItemProps) {
  const [gridProps, setGridProps] = useState(INITIAL_GRID_SIZE);
  const [yaml, setYaml] = useState<MesheryPatternFile>(pattern.pattern_file);

  return (
    <Grid2 size={gridProps}>
      <MesheryPatternCard
        data-testid="meshery-pattern-card-item"
        id={pattern.id}
        user={user}
        name={pattern.name}
        updated_at={pattern.updated_at}
        created_at={pattern.created_at}
        pattern_file={pattern.pattern_file}
        requestFullSize={() => setGridProps({ xl: 12, md: 12, xs: 12 })}
        requestSizeRestore={() => setGridProps(INITIAL_GRID_SIZE)}
        handleDeploy={handleDeploy}
        handleVerify={handleVerify}
        handleDryRun={handleDryRun}
        handlePublishModal={handlePublishModal}
        handleUnDeploy={handleUnDeploy}
        handleUnpublishModal={handleUnpublishModal}
        handleClone={handleClone}
        handleInfoModal={handleInfoModal}
        handleDownload={handleDownload}
        deleteHandler={() =>
          handleSubmit({
            data: yaml,
            id: pattern.id,
            type: FILE_OPS.DELETE,
            name: pattern.name,
            catalog_data: pattern.catalog_data,
          })
        }
        updateHandler={() =>
          handleSubmit({
            data: yaml,
            id: pattern.id,
            type: FILE_OPS.UPDATE,
            name: pattern.name,
            catalog_data: pattern.catalog_data,
          })
        }
        setSelectedPatterns={() => setSelectedPatterns({ pattern, show: true })}
        setYaml={setYaml}
        description={pattern.description}
        visibility={pattern.visibility}
        pattern={pattern}
        hideVisibility={hideVisibility}
        isReadOnly={isReadOnly}
      />
    </Grid2>
  );
}

/**
 * MesheryPatternGrid is the react component for rendering grid
 */

function MesheryPatternGrid({
  patterns = [],
  handlePublish,
  handleUnpublishModal,
  handleClone,
  handleSubmit,
  setSelectedPattern,
  selectedPattern,
  pages = 1,
  setPage,
  selectedPage,
  canPublishPattern = false,
  publishModal,
  setPublishModal,
  publishSchema,
  user,
  handleInfoModal,
  openDeployModal,
  openValidationModal,
  openUndeployModal,
  openDryRunModal,
  hideVisibility = false,
  arePatternsReadOnly = false,
  'data-testid': testId = 'meshery-patterns-grid',
}: MesheryPatternGridProps) {
  const { notify } = useNotification();
  const handlePublishModal = (pattern: MesheryPatternData) => {
    if (canPublishPattern) {
      setPublishModal({
        open: true,
        pattern: pattern,
        name: '',
      });
    }
  };
  const handlePublishModalClose = () => {
    setPublishModal({
      open: false,
      pattern: null,
      name: '',
    });
  };

  const [downloadModal, setDownloadModal] = useState({
    open: false,
    content: null as MesheryPatternData | null,
  });
  const handleDownload = (
    e: React.MouseEvent,
    design: MesheryPatternData,
    source_type: string | null,
    params?: string | null,
  ) => {
    e.stopPropagation();
    try {
      let id = design.id;
      let name = design.name;
      downloadContent({ id, name, type: 'pattern', source_type, params });
      notify({ message: `"${name}" design downloaded`, event_type: EVENT_TYPES.INFO });
    } catch (e) {
      console.error(e);
    }
  };
  const handleDownloadDialogClose = () => {
    setDownloadModal((prevState) => ({
      ...prevState,
      open: false,
      content: null,
    }));
  };

  const handleDesignDownloadModal = (e: React.MouseEvent, pattern: MesheryPatternData) => {
    e.stopPropagation();
    setDownloadModal((prevState) => ({
      ...prevState,
      open: true,
      content: pattern,
    }));
  };

  return (
    <div>
      {selectedPattern.show && (
        <TypedDesignConfigurator
          pattern={selectedPattern.pattern}
          show={setSelectedPattern}
          onSubmit={handleSubmit}
        />
      )}
      {!selectedPattern.show && (
        <Grid2 container spacing={3} size="grow" data-testid={testId}>
          {patterns.map((pattern) => (
            <PatternCardGridItem
              key={pattern.id}
              user={user}
              pattern={pattern}
              handleClone={() => handleClone(pattern.id, pattern.name)}
              handleDeploy={(e) => {
                openDeployModal(e, pattern.pattern_file, pattern.name, pattern.id);
              }}
              handleUnDeploy={(e) => {
                openUndeployModal(e, pattern.pattern_file, pattern.name, pattern.id);
              }}
              handleDryRun={(e) =>
                openDryRunModal(e, pattern.pattern_file, pattern.name, pattern.id)
              }
              handleVerify={(e) =>
                openValidationModal(e, pattern.pattern_file, pattern.name, pattern.id)
              }
              handlePublishModal={() => handlePublishModal(pattern)}
              handleUnpublishModal={(e) => handleUnpublishModal(e, pattern)()}
              handleInfoModal={() => handleInfoModal(pattern)}
              handleSubmit={handleSubmit}
              handleDownload={(e) => handleDesignDownloadModal(e, pattern)}
              setSelectedPatterns={setSelectedPattern}
              hideVisibility={hideVisibility}
              isReadOnly={arePatternsReadOnly}
            />
          ))}
        </Grid2>
      )}

      {!selectedPattern.show && patterns.length === 0 && (
        <GridNoPapperStyles>
          <GridNoContainerStyles>
            <GridNoTextStyles align="center" color="textSecondary">
              No Designs Found
            </GridNoTextStyles>
          </GridNoContainerStyles>
        </GridNoPapperStyles>
      )}
      {patterns.length ? (
        <GridPaginationStyles>
          <Pagination
            count={pages}
            page={selectedPage + 1}
            onChange={(_event: React.ChangeEvent<unknown>, page: number) => setPage(page - 1)}
          />
        </GridPaginationStyles>
      ) : null}

      {canPublishPattern && publishModal.open && (
        <SistentModal
          open={true}
          title={publishModal.pattern?.name}
          closeModal={handlePublishModalClose}
          aria-label="catalog publish"
          maxWidth="sm"
          headerIcon={
            <Pattern
              fill="#fff"
              style={{ height: '24px', width: '24px', fonSize: '1.45rem' }}
              className={undefined}
            />
          }
        >
          <RJSFModalWrapper
            schema={publishSchema.rjsfSchema}
            uiSchema={publishSchema.uiSchema}
            title={publishModal.pattern?.name || ''}
            handleNext={() => {}}
            submitBtnText="Submit for Approval"
            handleSubmit={handlePublish}
            helpText="Upon submitting your catalog item, an approval flow will be initiated.[Learn more](https://docs.meshery.io/concepts/catalog)"
            handleClose={handlePublishModalClose}
          />
        </SistentModal>
      )}
      <ExportModal
        downloadModal={downloadModal}
        handleDownloadDialogClose={handleDownloadDialogClose}
        handleDesignDownload={handleDownload}
      />
    </div>
  );
}

export default MesheryPatternGrid;
