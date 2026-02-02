import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const ExamplesTab = ({ vulnerability }) => {
  const [expandedExample, setExpandedExample] = useState(null);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h3 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Real-World Attack Examples
        </h3>
        <div className="space-y-4">
          {vulnerability?.attackExamples?.map((example, index) => (
            <div key={index} className="bg-muted/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedExample(expandedExample === index ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Icon name="Target" size={20} color="var(--color-error)" className="flex-shrink-0" />
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-sm md:text-base font-medium text-foreground">{example?.title}</div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-1">{example?.year}</div>
                  </div>
                </div>
                <Icon 
                  name={expandedExample === index ? 'ChevronUp' : 'ChevronDown'} 
                  size={20} 
                  color="var(--color-muted-foreground)"
                  className="flex-shrink-0"
                />
              </button>
              {expandedExample === index && (
                <div className="px-4 pb-4 border-t border-border">
                  <p className="text-sm md:text-base text-foreground leading-relaxed mt-4 mb-4">
                    {example?.description}
                  </p>
                  <div className="bg-background rounded-lg p-3 mb-3">
                    <div className="text-xs text-muted-foreground mb-2">Impact</div>
                    <div className="text-sm text-foreground">{example?.impact}</div>
                  </div>
                  <div className="bg-background rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-2">Lesson Learned</div>
                    <div className="text-sm text-foreground">{example?.lesson}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Common Exploitation Techniques
        </h4>
        <div className="space-y-3">
          {vulnerability?.exploitationTechniques?.map((technique, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <Icon name="Code" size={16} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground mb-1">{technique?.name}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{technique?.description}</div>
                </div>
              </div>
              <div className="bg-background rounded p-3 overflow-x-auto">
                <pre className="text-xs font-data text-foreground">
                  <code>{technique?.payload}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Prevention Best Practices
        </h4>
        <div className="space-y-2">
          {vulnerability?.preventionPractices?.map((practice, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-success/5 border border-success/20 rounded-lg">
              <Icon name="Shield" size={16} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground mb-1">{practice?.title}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{practice?.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3">
          Additional Resources
        </h4>
        <div className="space-y-2">
          {vulnerability?.resources?.map((resource, index) => (
            <a
              key={index}
              href={resource?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
            >
              <Icon name="ExternalLink" size={16} color="var(--color-primary)" className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-primary truncate">{resource?.title}</div>
                <div className="text-xs text-muted-foreground">{resource?.source}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="BookOpen" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground mb-2">Learning Path</div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Understanding this vulnerability type is crucial for secure development. Review the examples above, practice identifying similar patterns in your code, and implement the recommended prevention practices in your development workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplesTab;
