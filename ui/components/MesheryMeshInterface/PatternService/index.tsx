import React from 'react';
import RJSFWrapper from './RJSF_wrapper';
import type {
  MesheryRJSFFormData,
  MesheryRJSFSchema,
} from '../../types/design';

type PatternServiceProps = {
  jsonSchema: MesheryRJSFSchema;
  onChange: (_formData: MesheryRJSFFormData) => void;
  onSubmit?: (_formData: MesheryRJSFFormData) => void;
  onDelete?: (_formData: MesheryRJSFFormData) => void;
  type: 'trait' | 'workload';
  formData: MesheryRJSFFormData;
  RJSFWrapperComponent?: React.ElementType;
  RJSFFormChildComponent?: React.ElementType;
};

function PatternService({
  formData,
  jsonSchema,
  onChange,
  type,
  onSubmit,
  onDelete,
  RJSFWrapperComponent,
  RJSFFormChildComponent,
}: PatternServiceProps) {
  const properties = jsonSchema?.properties ?? {};

  if (Object.keys(properties).length > 0)
    return (
      <RJSFWrapper
        formData={formData}
        hideSubmit={type === 'trait'}
        hideTitle={type === 'workload'}
        jsonSchema={jsonSchema}
        onChange={onChange}
        onSubmit={onSubmit}
        onDelete={onDelete}
        RJSFWrapperComponent={RJSFWrapperComponent}
        RJSFFormChildComponent={RJSFFormChildComponent}
      />
    );
  return null;
}

export default PatternService;
