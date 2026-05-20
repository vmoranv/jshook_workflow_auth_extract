import {
  defineWorkflow,
  sequenceStep,
} from '@jshookmcp/extension-sdk/workflow';

const workflowId = 'workflow.auth-extract.v1';

export default defineWorkflow(workflowId, 'Network Auth Extractor', (workflow) =>
  workflow
.description('Collect requests, extract auth tokens/cookies, and export HAR.')
  .tags(['workflow', 'network', 'auth'])
  .timeoutMs(3 * 60_000)
  .defaultMaxConcurrency(1)
  .buildGraph(() => {
    return sequenceStep('auth-extract-root', (root) => {

    root
      .tool('get-requests', 'network_get_requests', {
        input: {
          autoEnable: true,
          limit: 200,
        },
      })
      .tool('extract-auth', 'network_extract_auth', {
        input: {
          minConfidence: 0.4,
        },
      })
      .tool('export-har', 'network_export_har', {
        input: {
          includeBodies: false,
        },
      });

    });
  })
  );