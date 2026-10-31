import React from 'react';
import { PortfolioData, TemplateType } from '../types/portfolio';
import { MinimalTemplate } from './MinimalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { DeveloperTemplate } from './DeveloperTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';

interface Props {
  data: PortfolioData;
  templateOverride?: TemplateType;
}

export const TemplateRenderer: React.FC<Props> = ({ data, templateOverride }) => {
  const currentTemplate = templateOverride || data.selectedTemplate || 'modern';

  switch (currentTemplate) {
    case 'minimal':
      return <MinimalTemplate data={data} />;
    case 'developer':
      return <DeveloperTemplate data={data} />;
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'professional':
      return <ProfessionalTemplate data={data} />;
    case 'modern':
    default:
      return <ModernTemplate data={data} />;
  }
};
