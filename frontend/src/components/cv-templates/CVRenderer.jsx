import React from 'react';
import TemplateProfessional from './TemplateProfessional';
import TemplateModern from './TemplateModern';
import TemplateMinimalist from './TemplateMinimalist';

const CVRenderer = ({ templateId = 'modern', data }) => {
  switch (templateId) {
    case 'professional':
      return <TemplateProfessional data={data} />;
    case 'minimalist':
      return <TemplateMinimalist data={data} />;
    case 'modern':
    default:
      return <TemplateModern data={data} />;
  }
};

export default CVRenderer;
